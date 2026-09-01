import Spin from "@/components/icons/Spin";

const Loading = () => {
  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
      <Spin size={32} className="text-main" />
    </div>
  );
};

export default Loading;
