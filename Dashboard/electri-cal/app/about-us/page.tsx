import React from "react";
import ElectriCal from "../components/Header/electriCal";
import HelpMenu from "../components/Header/aboutUs";
import Image from "next/image";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div className="bg-base-100 p-5">
      <header className="grid grid-cols-[15fr_2fr] font-bold font-sans text-primary bg-base-300 p-3 card shadow-sm shadow-primary-content">
        <ElectriCal />
        <HelpMenu />
      </header>

      <main className="flex flex-col justify-between lg:flex-row w-full max-w-8xl mx-auto p-4 my-6">
        {/* Left Side (Vision and Contact) */}
        <div className="flex flex-col w-full lg:w-2/5 mb-10 lg:mb-0">
          {/* Vision Section */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              How It Started
            </h2>
            <p className="text-lg leading-7">
              Our vision is to create a cost-effective, sustainable network of
              EV charging stations throughout California&apos;s urban areas. By
              leveraging renewable energy sources and advanced data-driven
              insights, we will strategically deploy charging infrastructure to
              promote widespread electric vehicle adoption.
            </p>
          </section>

          {/* Contact Section */}
          <section className="my-20">
            <h3 className="text-lg font-semibold mb-2">Contact us :</h3>
            <p>
              Email:{"  "}
              <span className="text-blue-400">
                <Link href="mailto:parthratra11@gmail.com">
                  parthratra11@gmail.com
                </Link>
              </span>
            </p>
            <p>
              Phone:{" "}
              <span className="text-blue-400">
                <Link href="tel:+919953420015">+91-9953420015</Link>
              </span>
            </p>
          </section>
        </div>

        {/* Right Side (Team and Image) */}
        <div className="flex bg-blue-600 w-full lg:w-2/5 rounded-2xl absolute right-0 ">
          {/* Team Section */}
          <section className=" text-white p-6 mb-6 flex-grow ">
            <h4 className="text-4xl font-bold mb-8">Our Team</h4>
            <ul>
              <li className="mb-4 text-2xl font-semibold">
                <Link href="https://www.linkedin.com/in/rahul-sharma-b96866280/">
                  Rahul Sharma
                </Link>
                <span className="block text-sm text-gray-200">
                  <Link href="mailto:sharma15705rahul@gmail.com">
                    sharma15705rahul@gmail.com
                  </Link>
                </span>
              </li>
              <li className="mb-4 text-2xl font-semibold">
                <Link href="https://www.linkedin.com/in/parthratra11/">
                  Parth Ratra
                </Link>
                <span className="block text-sm text-gray-200">
                  <Link href="mailto:parthratra11@gmail.com">
                    parthratra11@gmail.com
                  </Link>
                </span>
              </li>
              <li className="mb-4 text-2xl font-semibold">
                <Link href="https://www.linkedin.com/in/pranay-rajvanshi/">
                  Pranay Rajvanshi
                </Link>
                <span className="block text-sm text-gray-200">
                  <Link href="mailto:pranay.rajvanshi@gmail.com">
                    pranay.rajvanshi@gmail.com
                  </Link>
                </span>
              </li>
              <li className="mb-4 text-2xl font-semibold">
                <Link href="https://www.linkedin.com/in/kirti-rathi-92b273284/">
                  Kirti Rathi
                </Link>
                <span className="block text-sm text-gray-200">
                  <Link href="mailto:kirtirathi282@gmail.com">
                    kirtirathi282@gmail.com
                  </Link>
                </span>
              </li>
              <li className=" text-2xl font-semibold">
                <Link href="https://www.linkedin.com/in/sakshi-dhariwal-626b11295/">
                  Sakshi Dhariwal
                </Link>
                <span className="block text-sm text-gray-200">
                  <Link href="mailto:dhariwalsakshi257@gmail.com">
                    dhariwalsakshi257@gmail.com
                  </Link>
                </span>
              </li>
            </ul>
          </section>

          {/* Image Section */}
          <div className="relative h-auto w-80">
            <Image
              src="/images/team.png"
              alt="Team photo"
              layout="fill"
              objectFit="cover"
              // className="rounded-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;
