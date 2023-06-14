const Error = ({
  error,
  message,
}: {
  error?: Error & any;
  message?: string;
}) => {
  message = message ?? error.message ?? null;
  error = error?.cause ?? error;

  const action = "Try refreshing the page in a bit.";
  const status = error.status ?? error.statusText ?? error.code ?? null;

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

export default Error;
