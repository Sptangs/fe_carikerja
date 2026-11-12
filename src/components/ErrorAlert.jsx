export default function ErrorAlert({ message, errors }) {
  if (!message && !errors) return null

  return (
    <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
      {message ? <p>{message}</p> : null}
      {errors ? (
        <ul className="mt-2 list-inside list-disc">
          {Object.entries(errors).flatMap(([field, messages]) =>
            (Array.isArray(messages) ? messages : [messages]).map((text, index) => (
              <li key={`${field}-${index}`}>{text}</li>
            )),
          )}
        </ul>
      ) : null}
    </div>
  )
}
