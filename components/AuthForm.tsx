'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { createAccount } from '@/lib/actions/user.actions'
import OtpModal from './OTPModal'

// Define the type for the form, either 'sign-in' or 'sign-up'
type FormType = 'sign-in' | 'sign-up'

// Function to create the schema for form validation based on the form type
const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.string().email(), // Email field must be a valid email
        fullName:
            formType === 'sign-up'
                ? z.string().min(2).max(50) // Full name is required for sign-up and must be between 2 and 50 characters
                : z.string().optional(), // Full name is optional for sign-in
    })
}

// AuthForm component that takes a 'type' prop to determine if it's a sign-in or sign-up form
const AuthForm = ({ type }: { type: FormType }) => {
    const [isLoading, setIsLoading] = useState(false) // State to manage loading state
    const [errorMessage, setErrorMessage] = useState('') // State to manage error messages
    const [accountId, setAccountId] = useState(null)

    // Create the form schema based on the form type
    const formSchema = authFormSchema(type)
    // Initialize the form with react-hook-form and zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
        },
    })

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true) // Set loading state to true
        setErrorMessage('') // Clear any existing error messages

        try {
            const user = await createAccount({
                fullName: values.fullName || '',
                email: values.email,
            })

            setAccountId(user.accountId)
        } catch {
            setErrorMessage('Failed to create account, please try again.') // Set error message if account creation fails
        } finally {
            setIsLoading(false) // Set loading state to false
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="auth-form"
                >
                    <h1 className="form-title ">
                        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </h1>
                    {type === 'sign-up' && (
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                className="shad-input"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="shad-form-message" />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="form-submit-button"
                        disabled={isLoading}
                    >
                        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        {isLoading && (
                            <Image
                                src="/assets/icons/loader.svg"
                                alt="loader"
                                width={24}
                                height={24}
                                className="ml-2 animate-spin"
                            />
                        )}
                    </Button>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <div className="body-2 flex justify-center">
                        <p className="text-light-100">
                            {type === 'sign-in'
                                ? "Don't have an account?"
                                : 'Already have an account?'}
                        </p>
                        <Link
                            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className="ml-1 font-medium text-brand"
                        >
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </div>
                </form>
            </Form>
            {/* OTP verification */}

            {accountId && (
                <OtpModal
                    email={form.getValues('email')}
                    accountId={accountId}
                />
            )}
        </>
    )
}

export default AuthForm
