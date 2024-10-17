import React from 'react';
import './css/input.css';
import Banner from './Banner';

function Contact() {
    return (
    <div className="bg-[#ffffff] dark:bg-gray-800 w-screen h-screen overflow-hidden">
        <Banner/>
        <div className='bg-[#101c26]'>
            <section className='py-2'>
                <div className='max-w-6xl mx-auto p-4 md:p-16 xl:p-20'>
                    <div className='lg:w-2/3 space-y-5 text-center mx-auto'>
                        <h1 className='text-white uppercase tracking-wides font-medium text-4xl'>
                            Get in touch
                        </h1>
                        <div className='h-0.5 bg-red-500 w-14 mx-auto'></div>
                        <p className='text-gray-300 text-base leading-6'>
                            We'd love to hear from you!
                        </p>
                    </div>
                    <div className='grid grid-cols-1 gap-6 mt-16'>
                        <div className='lg:col-span-2'>
                            <form action=''>
                                <div className='space-y-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <label for='name' className='sr-only'>Name</label>
                                        <input
                                        type='text'
                                        name='name'
                                        id='name'
                                        className='border text-gray-900 text-sm rounded focus:ring-0 focus:border-gray-400 block w-full p-3 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-gray-300/50'
                                        placeholder='Enter your name'
                                        />
                                        <label for='email' className='sr-only'>Email</label>
                                        <input
                                        type='email'
                                        name='email'
                                        id='email'
                                        className='border text-gray-900 text-sm rounded focus:ring-0 focus:border-gray-400 block w-full p-3 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-gray-300/50'
                                        placeholder='Enter your email'
                                        />
                                    </div>
                                    <label for='subject' className='sr-only'>Subject</label>
                                        <input
                                        type='text'
                                        name='subject'
                                        id='subject'
                                        className='border text-gray-900 text-sm rounded focus:ring-0 focus:border-gray-400 block w-full p-3 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-gray-300/50'
                                        placeholder='Enter your subject'
                                        />
                                        <label for='comments' className='sr-only'>Message</label>
                                        <textarea
                                        name='comments'
                                        id='comments'
                                        className='border text-gray-900 text-sm rounded focus:ring-0 focus:border-gray-400 block w-full p-3 bg-zinc-700/20 border-zinc-700/50 placeholder:text-gray-300/50 text-gray-300/50'
                                        placeholder='Enter your Message'
                                        rows='3'
                                        ></textarea>
                                        <div className='text-right'>
                                            <input
                                            type='submit'
                                            id='submit'
                                            name='send'
                                            className='inline-block px-15 py-2.5 px-2.5 rounded text-sm cursor-pointer select-none outline-none transition-all duration-500 focus:ring-offset-0 hover:-translate-y-1.5 bg-red-500 text-white'
                                            value='Send Message'
                                            />
                                        </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    );
}
export default Contact;