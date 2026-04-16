import uuid
import io
import asyncio
from datetime import datetime
from functools import partial

# Import pyasyncore FIRST to patch Python 3.13 before Cassandra loads
import asyncore 

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from cassandra.cluster import Cluster, NoHostAvailable
from cassandra.io.asyncioreactor import AsyncioConnection
from minio import Minio
from minio.error import S3Error

from .auth import get_current_user

app = FastAPI()

# --- MinIO Setup ---
minio_client = Minio(
    "localhost:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

# --- Cassandra Setup ---
cluster = Cluster(['127.0.0.1'])
cluster.connection_class = AsyncioConnection # Using Asyncio instead of Gevent
cassandra_session = cluster.connect('ent_space')

@app.on_event("shutdown")
def shutdown():
    cluster.shutdown()

@app.post("/upload")
async def upload_course(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    username: str = Depends(get_current_user)
):
    BUCKET = "est-sale-courses"

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. MinIO Bucket Check
    try:
        if not minio_client.bucket_exists(BUCKET):
            minio_client.make_bucket(BUCKET)
    except S3Error as e:
        raise HTTPException(status_code=503, detail=f"MinIO bucket error: {e}")

    # 2. MinIO Upload
    file_name = f"{uuid.uuid4()}_{file.filename}"
    try:
        minio_client.put_object(
            BUCKET,
            file_name,
            io.BytesIO(file_bytes),
            length=len(file_bytes),
            content_type=file.content_type or "application/octet-stream"
        )
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO upload failed: {e}")

    file_url = f"http://localhost:9000/{BUCKET}/{file_name}"

    # 3. Cassandra Insert
    query = """
        INSERT INTO courses (id, title, description, file_url, teacher_name, upload_date)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            partial(
                cassandra_session.execute,
                query,
                (uuid.uuid4(), title, description, file_url, username, datetime.now())
            )
        )
    except NoHostAvailable as e:
        raise HTTPException(status_code=503, detail=f"Cassandra unreachable: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cassandra insert failed: {e}")

    return {
        "message": "Cours ajouté avec succès",
        "url": file_url,
        "filename": file_name,
        "uploaded_by": username
    }