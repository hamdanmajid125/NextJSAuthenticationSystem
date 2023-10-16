'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function RegisterPage(){
    const router = useRouter();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const registerUser = async (e) => {
        e.preventDefault();
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ data }) 
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            router.push('/api/auth/signin');
          } else {
            console.error('Failed to register user:', response.status);
          }
        } catch (error) {
          console.error('An error occurred during registration:', error);
        }
      };
    return (
        <div className="bg-white w-screen font-sans text-gray-900">
        <div className=" ">
          <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
            <div className="mx-2 py-12 text-center md:mx-auto md:w-2/3 md:py-20">
              <h1 className="mb-4 text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">
                Sign up
              </h1>
              <div className="text-lg sm:text-xl">
                <div className="">
                  <p className="mb-4">
                    Let's do this! Start your free trial by filling in our simple form
                    below. You will be hearing from us soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-1/3 lg:max-w-screen-lg xl:max-w-screen-xl">
          <form className="shadow-lg mb-4 rounded-lg border border-gray-100 py-10 px-8" onSubmit={registerUser}>
          <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="email">
               Name
              </label>
              <input
                className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                id="name"
                type="text"
                onChange={(e)=>{setData({...data,name: e.target.value})}}
                placeholder="Full Name"
                required=""
              />
              <span className="my-2 block" />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="email">
                E-mail
              </label>
              <input
                className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                id="email"
                type="email"
                onChange={(e)=>{setData({...data,email: e.target.value})}}
                placeholder="email"
                required=""
              />
              <span className="my-2 block" />
            </div>

          
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="password">
                Password
              </label>
              <input
                className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                id="password"
                type="password"
                onChange={(e)=>{setData({...data,password: e.target.value})}}
                placeholder="******************"
                required=""
              />
            </div>

            <div className="flex items-center">
              <div className="flex-1" />
              <button
                className="cursor-pointer rounded bg-blue-600 py-2 px-8 text-center text-lg font-bold  text-white"
                type="submit"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
      
      
      
    )
}