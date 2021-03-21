import he from "he";

const AnotherText = ({ data }: { data: string }) => {
  return <>{he.decode(data)}</>;
};

export default AnotherText;
