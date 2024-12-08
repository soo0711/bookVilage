https://www.python.org/downloads/ 
# 위 URL에서 파이썬 3.11.9 버전 설치


다운로드 받은 폴더에서 명령어 입력

# 추천 알고리즘 폴더로 이동
cd ai\recommend\content_based

![image](https://github.com/user-attachments/assets/5e512c29-8f83-4d8f-9167-84d63d97c38a)


# 가상환경 활성화
python -m venv venv


venv\Scripts\activate

![image](https://github.com/user-attachments/assets/17c5a270-76f2-4efd-bb7d-8e6d5b550249)


이처럼 왼쪽에 초록색 (venv) 표시가 뜨면 성공

# 이제 부터 모든 명령어는 가상환경 활성화 (왼쪽에 venv) 상태에서 실행
# 의존성 설치
python -m pip instasll --upgrade pip


pip install fastapi uvicorn sqlalchemy numpy pymysql

![image](https://github.com/user-attachments/assets/da796475-3c2c-4040-aad8-92c8b7653315)


# 설치 완료

# 임베딩 파일 압축 해제
https://drive.google.com/drive/folders/1gW_S7U3melPzcinAHKFOYj7aVnYrLMW8?usp=sharing

링크에서 받은 book_metadata.npy.gz, embeddings.npy.gz, similarities.npy.gz
파일들을 "ai\recommend\content_based\embeddings\klue_bert-base\"
폴더에 붙여넣기

이후 "\ai\recommend\content_based\decompress_file.py" 파일 열어 디렉토리 경로를 로컬 환경에 맞는 경로로 설정 
![image](https://github.com/user-attachments/assets/28907d6f-730e-4988-aa71-b36fa034adf7)

![image](https://github.com/user-attachments/assets/b5914a26-a242-45b6-a670-bd1e52eef5dc)


위의 경로 + embeddings/klue_bert-base하면 됨.

파일 저장 후

"ai\recommend\content_based\embeddings\klue_bert-base" 디렉토리로 이동

python .\decompress_file.py

명령어 실행


![image](https://github.com/user-attachments/assets/31021545-c6d7-4414-9fd9-bf9bf8b3f676)

# DB 연결
"ai\recommend\content_based\database.py" 파일 수정

![image](https://github.com/user-attachments/assets/43f9fc92-ee41-44ab-8e97-df55c972c507)


mysql+pymysql://{username}:{user_password}@{my_sql_ip}:{mysql_port}/{DB_NAME}
형식으로 DB의 계정 정보와 상태에 맞게 수정

# 서버 가동

ai\recommend\content_based\ 


디렉토리로 이동


uvicorn main:app --reload

![image](https://github.com/user-attachments/assets/5c9edf8a-7b92-430b-a8cb-924a078e7955)

크롬에서 
http://127.0.0.1:8000/docs
접속

![image](https://github.com/user-attachments/assets/be6b4826-c449-4ffd-825f-62d3b9e371d0)

Tri it out 클릭
![image](https://github.com/user-attachments/assets/474137bd-36c5-49d0-95fa-7a6db2c9bc0e)

user_id 칸에 DB 서버의 Book_register에 저장되어 있는 user_id 값 입력 -> Execute
![image](https://github.com/user-attachments/assets/454a0ff2-5086-4345-adf3-c8ec1157ea37)
# 정상 작동 확인
