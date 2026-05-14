-- 느린 소식 (제주ver) — Supabase 스키마
-- Supabase SQL Editor에서 전체 실행

-- ─── 테이블 ───────────────────────────────────────────

-- 성산일출봉 소원 (봉이)
CREATE TABLE wishes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  photo_url   TEXT,
  wish_text   TEXT NOT NULL,
  letter_text TEXT,               -- Claude Haiku 생성 편지 (제출 즉시)
  send_date   DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 배편 서신 방 (바람이)
CREATE TABLE rooms (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  send_date   DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','started','closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 방 참여자
CREATE TABLE room_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  matched_to_id UUID REFERENCES room_members(id),  -- 방 시작 후 순환 매칭
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 배편 서신 편지
CREATE TABLE letters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES room_members(id),
  receiver_id UUID NOT NULL REFERENCES room_members(id),
  photo_url   TEXT,
  content     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','sent','failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- OTP 인증 (임시)
CREATE TABLE otp_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      TEXT NOT NULL,
  code       TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 인덱스 ───────────────────────────────────────────

CREATE INDEX idx_wishes_send_date_status  ON wishes (send_date, status);
CREATE INDEX idx_wishes_phone             ON wishes (phone);
CREATE INDEX idx_room_members_room_id     ON room_members (room_id);
CREATE INDEX idx_letters_room_id_status   ON letters (room_id, status);
CREATE INDEX idx_letters_sender_id        ON letters (sender_id);
CREATE INDEX idx_letters_receiver_id      ON letters (receiver_id);
CREATE INDEX idx_otp_phone_expires        ON otp_codes (phone, expires_at);

-- ─── RLS 활성화 ───────────────────────────────────────

ALTER TABLE wishes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms        ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters      ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes    ENABLE ROW LEVEL SECURITY;

-- ─── RLS 정책 ─────────────────────────────────────────

-- wishes: anon은 uuid로 단건 조회만 허용
CREATE POLICY "wishes_anon_select" ON wishes
  FOR SELECT TO anon
  USING (true);

-- rooms: anon 목록 조회 허용 (방 목록 노출용)
CREATE POLICY "rooms_anon_select" ON rooms
  FOR SELECT TO anon
  USING (true);

-- room_members: anon 조회 허용 (입장 처리용)
CREATE POLICY "room_members_anon_select" ON room_members
  FOR SELECT TO anon
  USING (true);

-- letters: anon은 uuid로 단건 조회만 허용
CREATE POLICY "letters_anon_select" ON letters
  FOR SELECT TO anon
  USING (true);

-- 나머지 모든 INSERT/UPDATE/DELETE는 service_role만 (API 라우트에서 서비스 롤 사용)
-- service_role은 RLS를 우회하므로 별도 정책 불필요

-- ─── Storage 버킷 안내 ────────────────────────────────
-- Supabase 대시보드 > Storage에서 아래 버킷을 수동 생성하세요:
-- 버킷명: photos
-- Public: true (URL로 직접 접근 가능)
