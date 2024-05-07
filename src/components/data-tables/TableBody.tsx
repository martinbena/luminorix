interface TableBodyProps<T> {
  data: T[];
  render: (item: T) => JSX.Element;
}

export default function TableBody<T>({ data, render }: TableBodyProps<T>) {
  if (!data.length)
    return (
      <p className="text-base font-medium text-center m-6">
        No data to show at the moment
      </p>
    );

  return <section className="mt-2">{data.map(render)}</section>;
}
