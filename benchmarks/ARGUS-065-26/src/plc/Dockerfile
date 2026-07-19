FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt plc.py ./
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5020
CMD ["python", "/app/plc.py"]
