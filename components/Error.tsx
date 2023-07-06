const Error = ({
  error,
  message,
}: {
  error?: Error & any;
  message?: string;
}) => {
  error = error?.cause ?? error;
  message = message ?? error.message ?? null;

  const action = recommendAction(message);
  const status = error?.status ?? error?.statusText ?? error?.code ?? null;

  console.error(error, message);

  return (
    <div className="w-full text-center">
      <p>Something went wrong ʕ•̠͡•ʔ</p>
      {/* todo: hide additional info in dropdown/details element */}
      {action && <p>{action}</p>}
      {message && (
        <pre className="inline-block rounded bg-neutral-50 px-1 font-['Aeonik_Mono'] text-sm">
          {message}
        </pre>
      )}
      {status && <p>Response Status: {status}</p>}
    </div>
  );
};

function recommendAction(message?: string) {
  if (message == "Load failed") {
    return "Try refreshing the page in a bit.";
  }
}

export default Error;
