FROM python:3.11.9-slim

WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt  

ENV FLASK_APP=api
ENV FLASK_ENV=development 
ENV FLASK_DEBUG=1

EXPOSE 5000 

CMD ["python", "-m", "flask", "--app", "api", "run", "--host=0.0.0.0", "--reload"]
