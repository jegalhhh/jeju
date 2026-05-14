-- Migration 001: 이름만 입장 + SMS 발송 시간 설정

-- room_members.phone nullable 허용 (이름만 입장 지원)
ALTER TABLE room_members ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE room_members ALTER COLUMN phone SET DEFAULT '';

-- rooms에 발송 시간 추가 (KST 기준 HH:MM, 기본 09:00)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS send_time TEXT NOT NULL DEFAULT '09:00';

-- wishes에 발송 시간 추가
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS send_time TEXT NOT NULL DEFAULT '09:00';
