
from fastapi import FastAPI

from fastapi import  HTTPException

from aiModel import generate_report
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/generate_report/{zip_code}")
async def get_report(zip_code: str):
    try:
        report = generate_report(zip_code)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

