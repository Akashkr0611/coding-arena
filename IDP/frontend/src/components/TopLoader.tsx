export const TopLoader = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return (
    <div className="top-loader"></div>
  );
};
