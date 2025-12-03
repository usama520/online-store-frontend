# ✅ **Next.js – Project Rules / Best Practices (Copy into Cursor)**

## **1. General Architecture**

- Use the **App Router** (`app/`) for all new pages.
- Use **Server Components by default**.
  - Only use **Client Components** when absolutely required (state, effects, event listeners, browser APIs).

- Keep components **pure** and side-effect-free unless they are Client Components.
- Place business logic in **server functions**, not React components.

---

## **2. File & Folder Structure**

- Organize routes like:

  ```
  app/
    (marketing)/
    (dashboard)/
    api/
    components/
    lib/
    hooks/
    types/
  ```

- Reusable UI goes inside `app/components`.
- Shared logic or utilities go inside `app/lib`.
- Keep all TypeScript types in `app/types`.

---

## **3. Data Fetching Rules**

- **Prefer Server Components** + `fetch()` with caching.
- If you need real-time updates or client state → use a **Client Component** and:
  - SWR
  - React Query
  - Apollo Client (GraphQL)

- Use `fetch()` with:
  - **cache: 'force-cache'** for static data
  - **cache: 'no-store'** for dynamic, non-cacheable data
  - **revalidate: <seconds>** for ISR

---

## **4. API Design (Routes API or Backend Integration)**

- API routes go under `app/api/*/route.ts`.
- Each route file must export only the HTTP verbs used:

  ```ts
  export async function POST(req: Request) {}
  ```

- Always validate input at the API boundary using:
  - Zod
  - Yup
  - Valibot

- Never trust client-provided data.

---

## **5. States & React Rules**

- **Avoid global state** unless absolutely required.
- For global state use:
  - Zustand
  - Jotai
  - Context API (only if small-scale)

- Never use Context for high-frequency updates (use Zustand instead).

---

## **6. Client Component Rules**

- A component must be a Client Component only if:
  - It uses `useState` / `useEffect` / `useRef`
  - It handles browser events (`onClick`, `onChange`)
  - It interacts with `window`, `localStorage`, `document`
  - It integrates with third-party UI libraries requiring the DOM

- Otherwise, it should be a **Server Component**.

---

## **7. Server Component Rules**

- Can safely fetch data (uses backend credentials, tokens, secrets).
- Can use async/await directly in the component body.
- Must avoid:
  - Browser APIs
  - `useState`, `useEffect`, `useRef`
  - Event handlers

---

## **8. Authentication & Session Handling**

- Prefer **NextAuth** or **custom JWT session** with:
  - HttpOnly cookies
  - Secure cookies in production

- Never store JWTs in localStorage.

---

## **9. Styling Rules**

- Use:
  - Tailwind CSS
  - ShadCN/UI components

- Avoid writing large amounts of CSS.
- Use `class-variance-authority` for component variants.

---

## **10. Performance Rules**

- Use **React Server Components** to reduce bundle size.
- Use `next/image` for all images.
- Use `next/font` for optimized font loading.
- Avoid large libraries in Client Components.
- All lists must use `key` values that are stable and unique.

---

## **11. Error Handling**

- Use Next.js error boundaries:
  - `error.tsx` for route-level errors
  - `not-found.tsx` for 404

- Always handle rejections in Server Actions.

---

## **12. Forms & Server Actions**

- Prefer **Server Actions** over API routes for form submissions.
- Validate all form input using Zod before saving.

---

## **13. Environment Variables**

- All secrets go in `.env.local`
- NEVER expose secrets to the client—only variables prefixed with `NEXT_PUBLIC_` are exposed.
- Validate env vars with a schema file (zod example):

  ```ts
  const env = z.object({
    DATABASE_URL: z.string().url(),
  });
  ```

---

## **14. Logging & Monitoring**

- Use:
  - Vercel Observability (if hosting on Vercel)
  - Sentry or Logtail for error reporting

- Never log sensitive user data.

---

## **15. Deployment Rules**

- Always build with:

  ```
  next build
  ```

- Use Vercel or AWS for production deployments.
- Enable Vercel caching & ISR if possible.
