FROM python:3.12

COPY . .

RUN pip install -r requirements.txt

RUN python process.py

CMD ["uvicorn", "app:app", "--reload"]
