"use client"

import { Book } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BookCard = ({ book }: { book: Book }) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="overflow-hidden h-fit">
                <CardHeader className="p-0">
                    <div className="aspect-[3/4] overflow-hidden">
                        <Link href={`/book/${book._id}`}>
                            <Image
                                src={book.coverImage}
                                alt={`${book.title} cover`}
                                width={800}
                                height={800}
                                className="size-full transition-transform duration-300 hover:scale-105"
                            />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <h3 className="text-xl font-semibold tracking-tight">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href={`/book/${book._id}`} className="w-full">
                        <Button variant="secondary" className="w-full">
                            Read more
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default BookCard