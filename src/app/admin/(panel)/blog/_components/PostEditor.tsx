"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  SaveIcon,
  ArrowLeftIcon,
  ImageIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { createPostAction, updatePostAction } from "../../../actions";
import { RichTextEditor } from "./RichTextEditor";
import type { Post } from "@/lib/supabase";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const inputCls =
  "w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600/70 focus:bg-gray-900 transition-colors";

const labelCls = "block text-xs font-medium text-gray-500 mb-1.5";

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.cover_image ?? null);
  const [removeCover, setRemoveCover] = useState(false);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(toSlug(v));
  };

  const handleSlugChange = (v: string) => {
    setSlug(toSlug(v));
    setSlugManual(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setPreview(URL.createObjectURL(file));
    setRemoveCover(false);
  };

  const handleRemoveCover = () => {
    setNewFile(null);
    setPreview(null);
    setRemoveCover(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = () => {
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("tags", tags);
    fd.set("content", content);
    fd.set("published", String(published));
    if (newFile) {
      fd.set("cover_image", newFile);
    } else if (!removeCover && post?.cover_image) {
      fd.set("keep_cover_image", post.cover_image);
    }

    startTransition(async () => {
      const result = post
        ? await updatePostAction(post.id, fd)
        : await createPostAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin?tab=blog");
        router.refresh();
      }
    });
  };

  const tagPills = tags.split(",").map((t) => t.trim()).filter(Boolean);
  const isBlobPreview = preview?.startsWith("blob:");

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin?tab=blog"
          className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <ArrowLeftIcon size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">
            {post ? "Edit post" : "New post"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {post ? `Editing "${post.title}"` : "Write a new blog post"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelCls}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My awesome post"
            required
            className={`${inputCls} text-base font-semibold`}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>Slug</label>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 bg-gray-900 border border-r-0 border-gray-800 rounded-l-lg px-3 py-2 shrink-0">
              /blog/
            </span>
            <input
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="my-awesome-post"
              className={`${inputCls} rounded-l-none`}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelCls}>
            Excerpt{" "}
            <span className="text-gray-600">(optional — shown on listing page)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short description of this post…"
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Tags */}
        <div>
          <label className={labelCls}>
            Tags <span className="text-gray-600">(comma separated)</span>
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, Next.js, CSS"
            className={inputCls}
          />
          {tagPills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tagPills.map((t) => (
                <span
                  key={t}
                  className="bg-gray-800 text-yellow-600 rounded-full text-xs px-2.5 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div>
          <label className={labelCls}>
            Cover image <span className="text-gray-600">(optional)</span>
          </label>
          {preview ? (
            <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
              <Image
                src={preview}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized={isBlobPreview}
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
              >
                <XIcon size={13} />
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 text-xs bg-black/60 text-gray-300 hover:text-white px-2.5 py-1 rounded-md transition-colors"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2.5 w-full rounded-xl border border-dashed border-gray-800
                         px-4 py-8 text-sm font-medium text-gray-500 hover:text-white hover:border-gray-600 transition-colors"
            >
              <ImageIcon size={16} />
              Upload cover image
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Content */}
        <div>
          <label className={labelCls}>Content</label>
          <RichTextEditor
            defaultContent={content}
            onChange={setContent}
          />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors ${
              published
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-gray-700 text-gray-500 hover:text-white hover:border-gray-600"
            }`}
          >
            {published ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
            {published ? "Published" : "Draft"}
          </button>

          <div className="flex items-center gap-2">
            {slug && (
              <a
                href={`/blog/${slug}${!published ? "?preview=true" : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-700
                           text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <ExternalLinkIcon size={13} />
                Preview
              </a>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={pending || !title || !slug}
              className="flex items-center gap-2 text-sm px-5 py-2 rounded-lg bg-yellow-600 text-black
                         font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40"
            >
              {pending ? (
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <SaveIcon size={14} />
              )}
              {pending ? "Saving…" : post ? "Save changes" : "Create post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
