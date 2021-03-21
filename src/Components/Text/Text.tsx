import he from "he";

const Text = ({ data }: { data: string }) => {
  return <>{he.decode(data)}</>;
};

export default Text;
