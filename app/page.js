import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative w-full">
        <Image
          width={100}
          height={100}
          src="/students.jpeg"
          alt="Students"
          className="w-full object-cover"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-6">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Students Smart Card
          </h1>
          <p className="text-xl mb-8">
            Your gateway to a seamless campus experience
          </p>
        </div>
      </div>
      <div className="my-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-20">
          <Link href="/office-login">
            <div className="border rounded-md p-3 py-6 items-center flex flex-col cursor-pointer hover:shadow-md">
              <Image
                src="/office-building.png"
                alt="Office"
                width={88}
                height={80}
                priority
                loading="eager"
              />
              <h2>Office Login</h2>
            </div>
          </Link>
          <Link href={{ pathname: "/userlogin", query: { id: "library" } }}>
            <div className="border rounded-md p-3 py-6 items-center flex flex-col cursor-pointer hover:shadow-md">
              <Image
                src="/book.png"
                alt="Library"
                width={88}
                height={80}
                priority
                loading="eager"
              />
              <h2>Library Login</h2>
            </div>
          </Link>
          <Link href={{ pathname: "/userlogin", query: { id: "canteen" } }}>
            <div className="border rounded-md p-3 py-6 items-center flex flex-col cursor-pointer hover:shadow-md">
              <Image
                src="/canteen.png"
                alt="Canteen"
                width={88}
                height={80}
                priority
                loading="eager"
              />
              <h2>Canteen Login</h2>
            </div>
          </Link>
          <Link href={{ pathname: "/userlogin", query: { id: "stationary" } }}>
            <div className="border rounded-md p-3 py-6 items-center flex flex-col cursor-pointer hover:shadow-md">
              <Image
                src="/stationary.png"
                alt="Stationary"
                width={88}
                height={80}
                priority
                loading="eager"
              />
              <h2>Stationary Login</h2>
            </div>
          </Link>
          <Link href={{ pathname: "/student-login", query: { id: "dashboard" } }}>
            <div className="border rounded-md p-3 py-6 items-center flex flex-col cursor-pointer hover:shadow-md">
              <Image
                src="/graduated.png"
                alt="Dashboard"
                width={88}
                height={80}
                priority
                loading="eager"
              />
              <h2>Student Login</h2>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
