import Head from 'next/head'
import fetchJson from "lib/fetchJson";
import { useState } from 'react';
import { useRouter } from 'next/router';
import useUser from 'hooks/useUser';

export default function LoginPage() {
    const router = useRouter();
    const { mutateUser } = useUser();
    const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true)

    try {
      const body = {
        username: e.currentTarget.username.value.toLowerCase(),
        password: e.currentTarget.password.value,
      }
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
      router.push('/') // ROUTES.Dashboard
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMessage(error.data.message)
    }

    setSubmitting(false)
  }

  const inputStyle = `w-full mb-3 px-3 py-2 rounded border-2 border-gray-300
  font-extrabold tracking-wide focus:outline-none focus:border-blue-400`

  return (
    <>
      <Head>
        <title>ACES</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg--yellow-50 flex flex-col items-center justify-center min-h-screen">
        <div className="w-72 bg-white p-3">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              required={true}
              placeholder="username"
              className="w-full bg-blue-50 font-bold h-10 mb-3"
            />

            <input
              type="password"
              name="password"
              required={true}
              placeholder="password"
              className="w-full bg-blue-50 font-bold h-10 mb-3"
            />
            <div className={submitting
              ? "submitting h-1 bg-gray-200 mb-3"
              : "h-1 bg-gray-200 mb-3"}
            ></div>
            <button
              className={`w-full rounded py-2 bg-blue-500 text-white font-extrabold tracking-wide
              border-2 border-transparent focus:outline-none focus:border-blue-700
              `}
            >Submit</button>
          </form>
          {errorMessage && (
            <p className="mt-3 text-center text-red-500">{errorMessage}</p>
          )}
        </div>
      </main>
      <style jsx>{`
      .submitting {
        background-image: url(mango-in-progress-01.gif);
      }
      `}</style>
    </>
  )
}