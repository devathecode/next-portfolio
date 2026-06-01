"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  PlusIcon,
} from "lucide-react";
import { deletePostAction, togglePostPublishedAction } from "../../actions";
import type { Post } from "@/lib/supabase";
import { useFeedback } from "./feedback";
import { Badge, EmptyState, StatTile, btnIcon, btnPrimary, formatDate } from "./ui";

function PostRow({ post }: { post: Post }) {
  const { toast, confirm } = useFeedback();
  const [pending, startTransition] = useTransition();

  const handleDelete = async () => {
    const ok = await confirm({
      title: `Delete "${post.title}"?`,
      body: "The post will be removed from your blog. This can't be undone.",
    });
    if (!ok) return;
    startTransition(async () => {
      await deletePostAction(post.id);
      toast("Post deleted");
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      await togglePostPublishedAction(post.id, !post.published);
      toast(post.published ? "Post moved to drafts" : "Post published");
    });
  };

  return (
    <li
      className={`flex items-center gap-4 p-3 transition-opacity sm:p-4 ${
        pending ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-adm-border bg-adm-raised">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            width={80}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-adm-subtle">
            <FileTextIcon size={18} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/blog/${post.id}`}
          className="block truncate text-sm font-semibold text-adm-text hover:text-adm-accent-text"
        >
          {post.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge tone={post.published ? "success" : "neutral"}>
            {post.published ? "Published" : "Draft"}
          </Badge>
          {post.tags.slice(0, 2).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          <span className="text-xs text-adm-subtle">
            {post.published
              ? `Published ${formatDate(post.published_at)}`
              : `Created ${formatDate(post.created_at)}`}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <button
          onClick={handleToggle}
          title={post.published ? "Unpublish" : "Publish"}
          aria-label={post.published ? "Unpublish" : "Publish"}
          className={btnIcon}
        >
          {post.published ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
        </button>
        <Link href={`/admin/blog/${post.id}`} title="Edit" aria-label="Edit" className={btnIcon}>
          <PencilIcon size={16} />
        </Link>
        <button
          onClick={handleDelete}
          title="Delete"
          aria-label="Delete"
          className={`${btnIcon} hover:!text-adm-danger`}
        >
          <Trash2Icon size={16} />
        </button>
      </div>
    </li>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileTextIcon}
        title="No posts yet"
        body="Write your first article. You can save it as a draft and publish it later."
        action={
          <Link href="/admin/blog/new" className={btnPrimary}>
            <PlusIcon size={16} /> New post
          </Link>
        }
      />
    );
  }

  const published = posts.filter((p) => p.published).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total" value={posts.length} />
        <StatTile label="Published" value={published} tone="accent" />
        <StatTile label="Drafts" value={posts.length - published} />
      </div>
      <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
        {posts.map((p) => (
          <PostRow key={p.id} post={p} />
        ))}
      </ul>
    </div>
  );
}
