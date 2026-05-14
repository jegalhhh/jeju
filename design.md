---
version: alpha
name: 느린 소식 — 제주편
description: >
  제주 여행 중 적은 마음을 여행 후 일상으로 배달하는 서비스의
  모바일웹 디자인 시스템. 제주의 자연 — 바다, 일출, 현무암 — 의
  톤을 따뜻한 미니멀로 옮긴 편지 감성 시스템.

colors:
  # ─ Primary palette: 제주 바다 (default)
  bg:            "#f1ece1"
  paper:         "#faf6ec"
  ink:           "#1d2a2a"
  muted:         "#6e7d7b"
  line:          "#1d2a2a"          # 18% opacity in use
  line-soft:     "#1d2a2a"          # 8% opacity in use
  accent:        "#2c5752"
  accent-soft:   "#8aa5a1"
  envelope:      "#e6d6b6"
  envelope-flap: "#d8c69a"
  stamp:         "#b56a3e"

  # ─ Variant palette: 일출 (sunrise)
  sunrise-bg:        "#fbeede"
  sunrise-paper:     "#fff7ea"
  sunrise-ink:       "#2a1a12"
  sunrise-muted:     "#836755"
  sunrise-accent:    "#c25a3d"
  sunrise-accent-soft: "#e7a884"
  sunrise-envelope:  "#f4d8b9"
  sunrise-stamp:     "#9c3f22"

  # ─ Variant palette: 현무암 (basalt)
  basalt-bg:         "#e6e3dc"
  basalt-paper:      "#f4f1ea"
  basalt-ink:        "#1a1815"
  basalt-muted:      "#67635c"
  basalt-accent:     "#2f2c28"
  basalt-accent-soft: "#948e85"
  basalt-envelope:   "#cfc7b6"
  basalt-stamp:      "#58524a"

typography:
  display:
    fontFamily: Noto Serif KR
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Noto Serif KR
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif KR
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Noto Serif KR
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-serif:
    fontFamily: Noto Serif KR
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.85
  body-md:
    fontFamily: Gowun Dodum
    fontSize: 14.5px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Gowun Dodum
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.6
  hand-lg:
    fontFamily: Nanum Pen Script
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.2
  hand-md:
    fontFamily: Nanum Pen Script
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.3
  hand-sm:
    fontFamily: Nanum Pen Script
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.45
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10.5px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.22em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.14em
  caption-mono:
    fontFamily: JetBrains Mono
    fontSize: 9.5px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.15em

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 56px
  gutter: 28px
  card-pad: 24px
  step-pad: 18px

rounded:
  xs: 6px
  sm: 8px
  md: 14px
  lg: 18px
  xl: 28px
  full: 9999px

components:
  phone:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    width: 390px
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: 16px 18px
    typography: "{typography.body-md}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"           # 88% mixed with white at runtime
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px 18px
    typography: "{typography.body-md}"
  button-secondary-hover:
    backgroundColor: "{colors.line-soft}"
  feature-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 24px 22px 22px
  feature-illust-slot:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.md}"
    size: 64px
    # 1px dashed border in colors.line
  badge:
    textColor: "{colors.muted}"
    typography: "{typography.label-mono}"
  kicker:
    textColor: "{colors.muted}"
    typography: "{typography.label-caps}"
  pull-quote:
    textColor: "{colors.accent}"
    typography: "{typography.hand-lg}"
    # 2px solid left border in colors.accent, padding-left 16px
  step-row:
    padding: 18px 0
    # 0.5px solid top divider in colors.line
  letter-sheet:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.xl}"                   # top corners only
    width: 390px
  envelope:
    backgroundColor: "{colors.envelope}"
    rounded: "{rounded.xs}"
    padding: 60px 22px 22px
  envelope-flap:
    backgroundColor: "{colors.envelope-flap}"
    # clip-path triangle, animates open on sheet entry
  stamp:
    textColor: "{colors.ink}"
    typography: "{typography.caption-mono}"
    # 1px dashed border in colors.ink, 45% opacity
  letter-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 28px 24px
    typography: "{typography.hand-sm}"
  closing-seal:
    textColor: "{colors.accent}"
    typography: "{typography.caption-mono}"
    rounded: "{rounded.full}"
    size: 56px
    # 1px dashed border in colors.accent
---

# 느린 소식 — 제주편 · DESIGN.md

## Overview

‘느린 소식’은 제주 여행 중 사용자가 적은 편지·소원을 여행 이후의 일상으로 시간차 배달하는 모바일웹 서비스다. 디자인은 **제주의 자연(바다/일출/현무암)** 을 따뜻한 미니멀로 옮기고, 종이 편지와 우편의 잔잔한 메타포를 빌려와 ‘기다림’과 ‘안부’의 정서를 표현한다.

**Personality.** 잔잔함, 정중함, 손글씨의 따뜻함, 약간의 우편적 유물성(stamp / serial number / addresses). 화려한 그래픽 대신 **여백·세선·종이·손글씨**가 위계를 만든다.

**Audience.** 제주 게스트하우스 여행객. 앱 설치 없이 링크 하나로 진입하는 1회성·익명에 가까운 사용자, 그리고 그들이 보내는 미래의 자기 자신·동행자.

**Tonal range.**
- 단정한 본문 — Gowun Dodum / Noto Serif KR
- 손글씨 포인트 — Nanum Pen Script (인용·서명·헤드라인 보조)
- 우편 메타데이터 — JetBrains Mono (라벨·주소·시리얼)

**Mood references.** 1) 새벽 성산일출봉의 옅은 안개, 2) 바닷가의 햇볕에 바랜 편지지, 3) 현무암의 흐린 회색 입자.

## Colors

팔레트는 **세 가지 제주의 톤** 으로 운영되며, 사용자가 진입 시점에 선택할 수 있도록 토글로 노출한다(Tweaks 패널 참조). 기본은 `제주 바다`. 모든 팔레트는 동일한 의미 역할을 공유한다 — 변수만 갈아끼우면 전체 화면이 자연스럽게 톤을 갈아입는다.

### Primary — 제주 바다 (default)

- **`bg` (#f1ece1) · 모래빛 크림** — 화면 바탕. 햇볕에 바랜 종이의 토대.
- **`paper` (#faf6ec) · 더 밝은 종이** — 카드·편지지의 표면. `bg`보다 한 단계 위.
- **`ink` (#1d2a2a) · 깊은 송림 잉크** — 본문·표제·1차 액션. 검정보다 따뜻한 진녹.
- **`muted` (#6e7d7b) · 안개빛 회녹** — 메타데이터·캡션·보조 텍스트.
- **`line` (#1d2a2a, 18%) / `line-soft` (#1d2a2a, 8%)** — 디바이더·점선·경계. 잉크에서 파생.
- **`accent` (#2c5752) · 제주 송림녹** — 손글씨·포인트·페놀로지컬 강조. 상호작용 보조.
- **`accent-soft` (#8aa5a1) · 흐린 바다안개** — 일출 디스크·해일로 등 분위기 그래픽.
- **`envelope` (#e6d6b6) / `envelope-flap` (#d8c69a)** — 종이봉투. `bg` 계열의 따뜻한 변주.
- **`stamp` (#b56a3e) · 우표의 적동** — 봉인·인장·우표 모티프. 화면당 1회 등장 원칙.

### Variant — 일출 (sunrise)

따뜻한 산호색의 새벽 톤. `accent`가 일출 코랄(#c25a3d)로 이동하고 종이는 복숭아빛이 된다. ‘귀국일 아침에 도착하는 편지’ 같은 따뜻한 도착 시점에 유효.

### Variant — 현무암 (basalt)

회보라 톤의 정적·중성 팔레트. `accent`가 거의 검정(#2f2c28)에 수렴해 ‘기록 보관·관리자 페이지’ 분위기에 적합. 사진 컬러를 가장 잘 살린다.

> 모든 팔레트는 동일한 명도 위계를 유지한다: `bg` < `paper` (밝음), `ink`(가장 어두움) > `muted` > `accent` 순서로 텍스트 위계가 형성되어야 한다.

## Typography

세 가지 폰트 패밀리를 의도적으로 분업한다. 각각이 다른 ‘말투’ 를 담당하고, 한 화면에서 셋이 다 등장해도 위계가 깨지지 않는다.

- **Noto Serif KR (serif).** 정중한 표제와 본문 내러티브. 디스플레이 56px(`display`)부터 본문 16px(`body-serif`)까지. 자간은 헤드라인에서 음수(−0.02 ~ −0.03em)로 좁혀 단단한 인상을 준다.
- **Gowun Dodum (sans).** 화면 안내문·CTA·바디 카피의 기본 본문. 둥글되 또렷한 한글 산세리프로 ‘읽힘’을 책임진다.
- **Nanum Pen Script (hand).** 손글씨 포인트. 편지 본문(`hand-sm`), 인용·서명·헤드라인 보조 라인(`hand-md/lg`). 색은 항상 `accent`. **본문 전체를 손글씨로 깔지 말 것** — 한 화면에 1~2회만 등장시켜 ‘마음의 흔적’ 느낌을 유지한다.
- **JetBrains Mono (mono).** 우편 메타데이터 전용 — 발송번호, 주소, 좌표, 시각, 온도, 발송 상태. 모두 대문자 + 0.14~0.22em 자간으로 ‘우표·도장’ 의 텍스처를 낸다.

### Roles

| Token | 역할 |
|---|---|
| `display` | 랜딩 메인 타이틀(’느린 소식’) |
| `headline-lg` | 카드 표제(봉이·바람이) |
| `headline-md` | 섹션 표제(`천천히, 세 걸음.`) |
| `headline-sm` | 스텝 제목·편지 보낸이 표시 |
| `body-serif` | 컨셉 내러티브, 마무리 카피 |
| `body-md` | CTA·일반 본문 |
| `body-sm` | 스텝 설명·푸터·캡션 |
| `hand-lg` | 히어로 서브타이틀, 풀쿼트 |
| `hand-md` | 마무리 사인 |
| `hand-sm` | 편지 본문(`/letter/[uuid]`) |
| `label-caps` | 섹션 키커(`About`, `How`) |
| `label-mono` | 카드 배지(`01 · 성산일출봉 · 소원`) |
| `caption-mono` | 좌표·시각·발송번호 등 텔레메트리 |

## Layout

**그리드.** 단일 컬럼 모바일웹(390px 기준 디자인). 가로 padding(`gutter`)은 28px로 고정해 본문 폭은 ≈334px. 풀블리드 요소(일출 풍경 등)는 `.scroll` 컨테이너 안에서 `margin: 0 -28px`로 가장자리를 트는 방식.

**섹션 리듬.** 각 섹션 사이 56px(`xxl`). 한 화면당 위계는 `kicker(label-caps) → 표제 → 본문 → 행동` 의 4단으로 고정한다. ‘느린 소식’의 호흡감을 위해 의도적으로 넓은 여백을 둔다.

**터치 타깃.** 인터랙티브 요소(버튼·.go) 최소 44px. CTA는 항상 풀폭(width:100%) 스택.

**우편 라벨.** 모노스페이스 라벨은 항상 상하 또는 좌우 양 끝 정렬로 배치한다(좌: 위치, 우: 시각/상태). 단독으로 가운데 정렬하지 않는다.

### Spacing scale

8px 베이스의 부드러운 스케일. 마이크로(4) → 컴포넌트 내부(8·16·24) → 섹션 외부(32·56)로 점프한다.

## Elevation & Depth

깊이는 **무거운 그림자가 아닌 톤 레이어와 세선**으로 표현한다.

1. **무대(Stage).** 상위 배경은 `radial-gradient(120% 70% at 50% -10%, mix(bg,white) → bg)` — 위가 살짝 밝아 시선을 위로 끌어올린다.
2. **폰(Phone).** `bg` 위에 떠 있는 라운드 컨테이너. 그림자는 `0 24px 60px -22px rgba(0,0,0,.25)` 단 하나, 가장자리 0.5px `line` 보더로 마감.
3. **카드(feature/letter).** `paper`(밝은 종이) + `inset 0 1px 0 rgba(255,255,255,.6)` 으로 종이 위 광택 한 줄 + `outset 0 0 0 .5px line` 으로 경계. 편지 카드만 추가로 `0 18px 30px -16px rgba(0,0,0,.18)`.
4. **봉투(envelope).** 그림자 없이 색의 톤차로만 떠 보인다. `flap`은 `envelope-flap`로 한 톤 진하게.
5. **바텀시트(letter-sheet).** 강한 단일 그림자 `0 -20px 60px rgba(0,0,0,.3)` 와 백드롭 블러로 화면 위로 ‘떠오른다’.

> 그림자는 **세 단계만** 사용한다: 없음 / 카드(약) / 시트(강). 그 외 모든 깊이는 색의 톤차로 만든다.

## Shapes

**언어.** ‘둥근 종이의 모서리’. 카드·시트는 충분히 둥글지만(14~28px) 우표·라벨은 거의 직각에 가깝다(6px). 코너 라디우스가 컴포넌트의 **위계와 무게** 를 그대로 반영한다.

| 토큰 | 사용처 |
|---|---|
| `rounded.xs` 6px | 봉투, 인박스 라벨 |
| `rounded.sm` 8px | 사진 슬롯 |
| `rounded.md` 14px | 버튼, 일러스트 플레이스홀더, 편지 카드 |
| `rounded.lg` 18px | feature 카드 |
| `rounded.xl` 28px | 폰 컨테이너, 바텀시트(상단만) |
| `rounded.full` | 봉인 도장, 닫기 버튼, 토글 |

**점선과 실선.** 점선(dashed)은 ‘플레이스홀더’ 와 ‘봉인’ 에만 사용한다 — 일러스트 자리, 사진 자리, 우표, 마감 씰. 그 외 모든 디바이더는 0.5px 실선 `line`.

**일러스트 자리(placeholder).** 추후 캐릭터 일러스트가 들어갈 자리는 64×64 `rounded.md` + 1px dashed `line` + 모노스페이스 라벨로 표기한다. 자리 안에 단순 도형(반원·물결)을 한 개 두어 캐릭터의 ‘낌새’ 만 둔다.

## Components

### Buttons

- **`button-primary`** — 어두운 잉크 바탕, 종이색 텍스트. 풀폭 스택. 우측에 모노스페이스 화살표(`↗`/`→`) 한 글자. CTA 1개 화면당 1개 원칙.
- **`button-secondary`** — 투명 바탕, 0.5px `line` 보더. 본문 색 텍스트. 보조 동작(처음부터 시작하기, 이전 단계).
- **`tap.go`** — 카드 우하단의 인라인 동작 텍스트 (`accent` 색 + `→`). 카드 내부 보조 진입에만 사용.

> 버튼의 라벨은 항상 한 줄. `white-space: nowrap`을 기본값으로 두고, 라벨 컨테이너에 `flex: 1; min-width: 0` 를 줘서 줄바꿈을 막는다.

### Cards (feature)

`paper` 표면, `rounded.lg`. 내부 좌상단에 64×64 일러스트 슬롯 + 우측에 텍스트(배지·표제·서명). 하단은 0.5px dashed `line` 디바이더 + 좌측 모노스페이스 라벨 + 우측 `tap.go`.

### Letter (`/letter/[uuid]`)

봉투 → 편지 카드 → 외문구 의 3단 구성.
- 봉투(`envelope`): 상단 60px의 플랩, 시트 진입 시 `rotateX(180deg)` 로 0.7s 동안 열린다. 우상단에 점선 우표(`stamp`), 좌측에 FROM/TO 주소(모노).
- 편지 카드(`letter-card`): 본문은 손글씨 (`hand-sm` 22px). 사진은 4:3 비율의 점선 플레이스홀더. 푸터는 점선 디바이더 + 손글씨 서명(회전 -3deg) + 모노 메타데이터.

### Steps

상하 0.5px `line` 디바이더로 구분된 행. 좌측 56px 컬럼에 `STEP NN` 모노 라벨, 우측 컬럼에 표제+본문. 손글씨 한 줄(`hand-md`)을 스텝 중 한 군데(STEP 02)에 ‘쪽지처럼’ 비스듬히 얹어 리듬을 만든다.

### Pull quote

`accent` 좌측 보더 2px + padding-left 16px. 손글씨 `hand-lg`. 한 화면당 1회.

### Status bar (mock)

상단 14px padding, 좌측 시각(JetBrains Mono), 우측 ‘제주’ 라벨 + 14×7 배터리 글리프. 실서비스에서는 OS 상태바가 대체.

### Tweaks panel

우하단 플로팅 패널. 컬러 팔레트 한 줄(세그먼티드 라디오) — `바다 / 일출 / 현무암`. 그 외 컨트롤은 의도적으로 두지 않아 ‘느린’ 톤을 흐리지 않는다.

## Do's and Don'ts

**Do**
- 한 화면에 손글씨는 **1~2회만** 등장시킨다. 그 외는 정중한 산세리프/세리프로.
- 모노스페이스 라벨은 항상 대문자 + 충분한 자간(0.14em 이상).
- 일러스트가 없다면 점선 박스 + 모노 라벨을 그대로 둔다. 가짜 일러스트를 그리지 않는다.
- 동작이 발생하는 시점에 종이/봉투의 미세한 모션(0.5~0.7s)을 한 번만 준다.
- 팔레트 토글 시 색 전환은 0.5s ease로 부드럽게.
- 모노 라벨에는 위치·시간·번호 같은 ‘사실적 데이터’만 담는다.
- 우표·봉인은 화면당 1개를 넘기지 않는다.

**Don't**
- 화려한 그라디언트나 다중 채도 사용 금지. 무드는 톤차로 만든다.
- 이모지 사용 금지(편지/우편 메타포와 충돌). 모노 라벨로 대체.
- 본문을 손글씨 폰트로 깔지 않는다 — 읽기 어렵고 ‘낙서’가 된다.
- 둥근(rounded.lg+) 카드와 직각 카드를 같은 화면에 섞지 않는다.
- 그림자를 3단계 이상 늘리지 않는다. 깊이가 필요하면 색을 바꾼다.
- 액션 버튼 텍스트를 줄바꿈하지 않는다(`nowrap` 고정).
- ‘기다림’ 의 문구를 ‘재미·즉시·빠른’ 같은 단어와 같은 화면에 두지 않는다.
- 사진 자리에 인공적인 일러스트로 채우지 않는다 — 점선 슬롯을 유지해 사용자 사진의 자리를 비워둔다.

---

*Edition · 제주 · No.001 · v1.0 · written in Jeju, 2026*
