import ChatComponent from "./components/ChatComponent";
import FileUploadComponent from "./components/FileUploadComponent";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen w-screen flex">
      <div className="w-[30vw] min-h-screen p-4 flex justify-center items-center border-r-2 border-gray-200">
        <FileUploadComponent />
      </div>
      <div className="w-[70vw] min-h-screen flex flex-col">
        <ChatComponent />
      </div>
    </div>
  );
}
