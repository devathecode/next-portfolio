import React from 'react';
import Container from "@/app/components/Container";
import ContactForm from "@/app/components/contact/ContactForm/ContactForm";

export const metadata = {
    title: 'Contact | Devanshu Verma',
    description: 'Devanshu verma is a frontend web developer from Gorakhpur',
}

const Page = () => {
    return (
        <Container>
            <div className="max-w-5xl mx-auto mt-16">
                <div className="grid grid-cols-12 px-2 sm:px-12">
                    <div className="col-span-12 my-4 text-center">
                        <h1 className="text-3xl tracking-wider font-semibold">
                            <span className="text-white">Contact </span>
                            <span className="text-yellow-600">Us</span>
                        </h1>
                        <p className="text-sm text-gray-400 my-2">Hate forms? Send us an <a
                            href="mailto:devanshuv1501@gmail.com"
                            className="text-yellow-600 hover:underline">email</a> instead.</p>
                    </div>
                    <div className="col-span-12">
                        <ContactForm/>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Page;