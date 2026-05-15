"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  FileTextIcon,
} from "lucide-react";
import { deletePostAction, togglePostPublishedAction } from "../../actions";
import type { Post } from "@/lib/supabase";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PostRow({ post }: { post: Post }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    startTransition(() => deletePostAction(post.id));
  };

  const handleToggle = () => {
    startTransition(() =>
      togglePostPublishedAction(post.id, !post.published)
    );
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/60 p-3 transition-opacity ${
        pending ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Cover thumbnail */}
      <div className="shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={64}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileTextIcon size={18} className="text-gray-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white truncate">{post.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
              post.published
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-gray-800 text-gray-500 border border-gray-700"
            }`}
          >
            {post.published ? "Published" : "Draft"}
          </span>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-800 text-gray-500 rounded text-[10px] px-1.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-gray-600 mt-0.5">
          {post.published ? `Published ${formatDate(post.published_at)}` : `Created ${formatDate(post.created_at)}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleToggle}
          title={post.published ? "Unpublish" : "Publish"}
          className={`p-1.5 rounded-md transition-colors ${
            post.published
              ? "text-emerald-500 hover:text-emerald-300 hover:bg-gray-800"
              : "text-gray-600 hover:text-yellow-500 hover:bg-gray-800"
          }`}
        >
          {post.published ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
        </button>
        <Link
          href={`/admin/blog/${post.id}`}
          title="Edit"
          className="p-1.5 rounded-md text-gray-600 hover:text-yellow-500 hover:bg-gray-800 transition-colors"
        >
          <PencilIcon size={14} />
        </Link>
        <button
          onClick={handleDelete}
          title="Delete"
          className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <Trash2Icon size={14} />
        </button>
      </div>
    </div>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-2">
      {/* New post button */}
      <Link
        href="/admin/blog/new"
        className="flex items-center gap-2.5 w-full rounded-xl border border-dashed border-gray-800
                   px-4 py-3.5 text-sm font-medium text-gray-400 hover:text-white hover:border-gray-700
                   transition-colors bg-transparent"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400">
          <PlusIcon size={13} />
        </span>
        New post
      </Link>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <FileTextIcon size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts yet.</p>
          <p className="text-xs mt-1 text-gray-600">
            Click &ldquo;New post&rdquo; above to write your first blog post.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
