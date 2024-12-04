import jpype
from konlpy.tag import Okt

# JVM 경로 및 Classpath 설정
jvm_path = (
    r"C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot\bin\server\jvm.dll"
)
class_path = r"C:\p_project\bookVillage\ai\crawling\venv\Lib\site-packages\konlpy\java\open-korean-text-2.1.0.jar"

# JVM 시작
if not jpype.isJVMStarted():
    jpype.startJVM(jvm_path, f"-Djava.class.path={class_path}", "-Xms512m", "-Xmx1024m")

# JVM Classpath 출력
print("JVM Classpath:", class_path)

# Okt 사용 테스트
okt = Okt()
print(okt.nouns("Konlpy와 JVM 설정이 완료되었습니다."))
