#!/usr/bin/env python3
"""
eleven_gen.py - Generate images or videos with the ElevenLabs Image & Video API.

No extra packages needed (Python 3.9+ standard library only).
Requires an ElevenLabs Pro plan or higher (Free plan returns 402 paid_plan_required).

Setup:
  1. Put your key in a .env file in the project root:
        ELEVENLABS_API_KEY=your_key_here
     (and add .env to .gitignore)

Usage examples:
  # Image (default model gpt-image-2.5-sunburst)
  python scripts/eleven_gen.py image "dark minimal hero background, soft purple gradient" -o public/hero.png

  # Image with extra options (only sent if you pass them; support varies by model)
  python scripts/eleven_gen.py image "neon city skyline at dusk" -o public/hero.png --aspect-ratio 16:9 --resolution 2K

  # Video (default model veo-3.1-fast-generate-001)
  python scripts/eleven_gen.py video "slow drifting abstract gradient, seamless loop" -o public/hero.mp4 \
      --aspect-ratio 16:9 --resolution 1080p --duration 8 --no-audio

  # Any other model id from the ElevenLabs docs
  python scripts/eleven_gen.py image "..." -o out.png --model <model_id>
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

API_BASE = "https://api.elevenlabs.io/v1/flows"
DEFAULT_MODELS = {
    "image": "gpt-image-2.5-sunburst",
    "video": "veo-3.1-fast-generate-001",
}
POLL_SECONDS = {"image": 3, "video": 10}
TIMEOUT_SECONDS = {"image": 5 * 60, "video": 20 * 60}


def load_dotenv(path=".env"):
    """Minimal .env loader so no python-dotenv dependency is needed."""
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip().removeprefix("export ").strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def api_request(method, url, api_key, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("xi-api-key", api_key)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")
        if e.code == 402:
            sys.exit(f"Error 402: this feature needs a paid plan (Pro or above).\n{detail}")
        if e.code == 401:
            sys.exit(f"Error 401: API key invalid or missing permissions.\n{detail}")
        sys.exit(f"HTTP {e.code} from ElevenLabs:\n{detail}")
    except urllib.error.URLError as e:
        sys.exit(f"Network error: {e.reason}")


def build_body(kind, args):
    body = {"model_id": args.model or DEFAULT_MODELS[kind], "prompt": args.prompt}
    if args.aspect_ratio:
        body["aspect_ratio"] = args.aspect_ratio
    if args.resolution:
        body["resolution"] = args.resolution
    if kind == "video":
        if args.duration:
            body["duration_secs"] = args.duration
        body["generate_audio"] = not args.no_audio
    return body


def download(url, out_path):
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as resp, open(out_path, "wb") as f:
        while chunk := resp.read(1 << 16):
            f.write(chunk)


def main():
    parser = argparse.ArgumentParser(description="ElevenLabs image/video generator")
    parser.add_argument("kind", choices=["image", "video"])
    parser.add_argument("prompt", help="Text prompt describing what to generate")
    parser.add_argument("-o", "--output", required=True, help="Where to save the file")
    parser.add_argument("--model", help="Model id (defaults: image=gpt-image-2.5-sunburst, video=veo-3.1-fast-generate-001)")
    parser.add_argument("--aspect-ratio", help="e.g. 16:9 or 9:16")
    parser.add_argument("--resolution", help="e.g. 2K (image) or 720p / 1080p / 4K (video)")
    parser.add_argument("--duration", type=int, help="Video length in seconds (Veo: 4, 6 or 8)")
    parser.add_argument("--no-audio", action="store_true", help="Video only: generate without sound")
    args = parser.parse_args()

    load_dotenv()
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        sys.exit("ELEVENLABS_API_KEY not found. Add it to .env or your environment.")

    kind = args.kind
    body = build_body(kind, args)
    print(f"Submitting {kind} generation with model '{body['model_id']}'...")
    created = api_request("POST", f"{API_BASE}/{kind}", api_key, body)
    gen_id = created.get("id")
    if not gen_id:
        sys.exit(f"Unexpected response: {created}")
    print(f"Generation id: {gen_id}")

    deadline = time.time() + TIMEOUT_SECONDS[kind]
    last_status = None
    while True:
        result = api_request("GET", f"{API_BASE}/{kind}/get/{gen_id}", api_key)
        status = result.get("status")
        if status != last_status:
            print(f"Status: {status}")
            last_status = status
        if status == "completed":
            break
        if status == "failed":
            sys.exit(f"Generation failed: {result.get('failure_reason')} {result.get('error_message', '')}")
        if time.time() > deadline:
            sys.exit(f"Timed out waiting. Check later with id {gen_id}.")
        time.sleep(POLL_SECONDS[kind])

    content_url = result.get("content_url")
    if not content_url:
        sys.exit(f"Completed but no content_url found:\n{json.dumps(result, indent=2)}")

    print(f"Downloading to {args.output} ...")
    download(content_url, args.output)
    print(f"Done: {args.output} ({result.get('content_mime_type', 'unknown type')})")


if __name__ == "__main__":
    main()
