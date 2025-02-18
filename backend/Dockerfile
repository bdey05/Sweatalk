FROM python:3.11.9-slim
# Copy requirements.txt FIRST
COPY ./backend/requirements.txt /tmp/

# Set the working directory
WORKDIR /usr/src/app

# Copy the rest of your application code
COPY . .

RUN pip install -r requirements.txt  

ENV FLASK_APP=api
ENV FLASK_ENV=development 
ENV FLASK_DEBUG=1

EXPOSE 5000 

CMD ["python", "-m", "flask", "--app", "api", "run", "--host=0.0.0.0"]
