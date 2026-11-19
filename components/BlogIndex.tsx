"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "pet-health", label: "Pet Health" },
  { id: "nutrition", label: "Nutrition" },
  { id: "prevention", label: "Prevention" },
  { id: "ageing", label: "Ageing" },
  { id: "breed-health", label: "Breed Health" },
  { id: "behaviour", label: "Behaviour" },
  { id: "pet-parents", label: "Pet Parents" },
  { id: "science", label: "Science" },
] as const;

const POSTS = [
  {
    href: "/blog/5-things-your-pet-cant-tell-you",
    category: "pet-health",
    label: "Pet Health",
    title: "5 Things Your Pet Can't Tell You About Their Health",
    image: "/assets/images/cat-guide.jpg",
    alt: "Cat looking up during a health check",
    width: 1200,
    height: 800,
  },
  {
    href: "/blog/is-your-dog-at-healthy-weight",
    category: "nutrition",
    label: "Nutrition",
    title: "Is Your Dog Actually at a Healthy Weight?",
    image: "/assets/images/labrador.jpg",
    alt: "Labrador close-up",
    width: 1200,
    height: 800,
  },
  {
    href: "/blog/common-pet-health-problems",
    category: "prevention",
    label: "Prevention",
    title: "The Most Common Pet Health Problems We Catch Too Late",
    image: "/assets/images/grey-cat.jpg",
    alt: "Grey cat sitting upright",
    width: 1200,
    height: 826,
  },
  {
    href: "/blog/nutrition-long-term-health",
    category: "nutrition",
    label: "Nutrition",
    title: "How Nutrition Affects Your Pet's Long-Term Health",
    image: "/assets/images/puppy-grass.jpg",
    alt: "Puppy in grass",
    width: 1200,
    height: 800,
  },
  {
    href: "/blog/pet-behaviour-and-health",
    category: "behaviour",
    label: "Behaviour",
    title: "What Does Your Pet's Behaviour Say About Their Health?",
    image: "/assets/images/orange-cat.jpg",
    alt: "Orange cat sitting",
    width: 1200,
    height: 1680,
  },
  {
    href: "/blog/preventive-pet-care",
    category: "prevention",
    label: "Prevention",
    title: "Preventive Pet Care: What Should You Actually Be Doing?",
    image: "/assets/images/two-dogs.jpg",
    alt: "Two dogs outdoors",
    width: 1200,
    height: 801,
  },
  {
    href: "/blog/healthier-routine-for-dog",
    category: "pet-parents",
    label: "Pet Parents",
    title: "How to Build a Healthier Routine for Your Dog",
    image: "/assets/images/dog-running.jpg",
    alt: "Dog running outdoors",
    width: 1200,
    height: 800,
  },
  {
    href: "/blog/track-changes-senior-pet",
    category: "ageing",
    label: "Ageing",
    title: "What Changes Should You Track as Your Pet Gets Older?",
    image: "/assets/images/husky.jpg",
    alt: "Husky outdoors",
    width: 1200,
    height: 1600,
  },
  {
    href: "/blog/breed-specific-health-risks",
    category: "breed-health",
    label: "Breed Health",
    title: "Breed-Specific Health Risks Every Pet Parent Should Know",
    image: "/assets/images/corgi.jpg",
    alt: "Corgi portrait",
    width: 1200,
    height: 1811,
  },
  {
    href: "/blog/biological-age-for-pets",
    category: "science",
    label: "Science",
    title: "What Is Biological Age — And Could It Matter for Pets?",
    image: "/assets/images/tabby-cat.jpg",
    alt: "Tabby cat portrait",
    width: 1200,
    height: 1200,
  },
] as const;

function normalizeCategory(value: string) {
  return CATEGORIES.some((item) => item.id === value) ? value : "all";
}

export function BlogIndex({
  intro,
  initialCategory = "all",
}: {
  intro: React.ReactNode;
  initialCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(() => normalizeCategory(initialCategory));

  const posts = useMemo(
    () => (active === "all" ? POSTS : POSTS.filter((post) => post.category === active)),
    [active],
  );

  function setCategory(id: string) {
    const next = normalizeCategory(id);
    setActive(next);
    const query = next === "all" ? "" : `?category=${next}`;
    router.replace(`${pathname}${query}`, { scroll: false });
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="blog-intro">{intro}</div>
          <div className="category-nav" aria-label="Categories">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`category-link${active === item.id ? " is-current" : ""}`}
                aria-pressed={active === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-top-content-wrapper">
            <h2 className="display-8">Latest articles</h2>
          </div>
          <div className="grid-3 posts-grid stagger-group">
            {posts.map((post) => (
              <Link key={post.href} className="post-item" data-category={post.category} href={post.href}>
                <div className="image-wrapper is-border-radius-medium">
                  <img
                    src={post.image}
                    alt={post.alt}
                    width={post.width}
                    height={post.height}
                    decoding="async"
                    loading="lazy"
                  />
                </div>
                <div className="post-meta">
                  <span>{post.label}</span>
                </div>
                <h3 className="display-4">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
