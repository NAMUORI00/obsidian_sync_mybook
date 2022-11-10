# 옵시디언 백업 레포지토리

### 레포지토리 소개
---
- 이 페이지는 obsidian valut 백업, 싱크를 위해 생성된 레포지토리 입니다.
- 이 문서는 obsidian 노트 [링크](https://obsidian.md/) 를 이용하여 작성 되었으며
- obsidian-git 플러그인 기능을 통해 push, merge 를 진행합니다.
	- obsidian-git 플러그인에 대한 정보 [링크](https://github.com/denolehov/obsidian-git)

### Obisidan-git plugin 에 대한 내용
---
- 옵시디언 커뮤니티 플러그인 중 하나
- github를 통해 obsidian 에서 제공하는 sync 기능을 유사하게 구현한 플러그인
- 개인 깃허브에 노트를 push 하여 백업을 진행
- .obsdian 폴더에 있는 config, plugin 정보도 같이 백업 되므로 설정값도 저장이 가능

#### 플러그인의 장단점, 결론
--- 
##### 장점
- 유료기능의 sync 기능을 무료로 사용이 가능함
- github 에서 지원하는 github page 등과 연동하여 웹 퍼블리싱도 가능함
- notion 과 유사하게 각 문서별 버전관리가 가능하다

##### 단점
- git 플러그인 기본 설정에 대한 배경지식이 필요함.
	- 이러한 지식이 부족한 경우 일반 유저는 사용하기위한 설정이 번거로울 수 있음
- public 레포지토리에 obsidian valut 를 백업 하는 경우, 개인정보 누출 등의 프라이버시 문제가 발생할 수 있음

#####  결론
- github 와 연동할 시, public, private 레포에 어떤 식으로 저장할지 유의해야 한다
- git 레포지토리 연동시 ssh key, github 토큰등이 노출되지 않도록 주의 해야 한다

> 요약 : 일기등의 민감한 부분의 내용은 private 레포지토리나, encrypt 등의 처리를 한다.


