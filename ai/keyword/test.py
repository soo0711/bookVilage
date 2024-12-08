import jpype
from konlpy.tag import Okt, Komoran

# JVM 경로 설정 (Java 설치 경로에 따라 수정)
jvm_path = r"C:\Program Files\Java\jdk-20\bin\server\jvm.dll"

# JVM 시작 (한 번만 실행)
if not jpype.isJVMStarted():
    jpype.startJVM(jvm_path)

try:
    # JVM 기반 Komoran 테스트
    print("=== Komoran 테스트 ===")
    komoran = Komoran()
    text_komoran = "JPype와 KoNLPy의 Komoran을 함께 테스트합니다."
    print("Komoran 형태소:", komoran.morphs(text_komoran))
    print("Komoran 명사:", komoran.nouns(text_komoran))
    print("Komoran 품사 태깅:", komoran.pos(text_komoran))

    # JVM 비의존 Okt 테스트
    print("\n=== Okt 테스트 ===")
    okt = Okt()
    text_okt = "JPype와 KoNLPy의 Okt를 함께 테스트합니다."
    print("Okt 형태소:", okt.morphs(text_okt))
    print("Okt 명사:", okt.nouns(text_okt))
    print("Okt 품사 태깅:", okt.pos(text_okt))

finally:
    # JVM 종료 (필요하지 않다면 생략 가능)
    if jpype.isJVMStarted():
        jpype.shutdownJVM()
