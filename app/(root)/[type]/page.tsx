import { getFiles } from '@/lib/actions/file.actions'
import { getFileTypesParams } from '@/lib/utils'
import { Models } from 'node-appwrite'
import Card from '@/components/Card'
import Sort from '@/components/Sort'

interface PageProps {
    params: { type: string }
    searchParams: { query?: string; sort?: string }
}

const Page = async ({ params, searchParams }: PageProps) => {
    const type = params?.type || ''
    const searchText = searchParams?.query || ''
    const sort = searchParams?.sort || ''

    const types = getFileTypesParams(type) as FileType[]

    const files = await getFiles({ types, searchText, sort })

    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>
                <div className="total-size-section">
                    <p className="body-1">
                        Total:{' '}
                        <span className="h5">
                            (
                            {(
                                files.documents.reduce(
                                    (total: any, file: { size: any }) =>
                                        total + file.size,
                                    0
                                ) /
                                (1024 * 1024)
                            ).toFixed(2)}
                            MB)
                        </span>
                    </p>
                    <div className="sort-container">
                        <p className="body-1 hidden sm:block text-light-200">
                            Sort By:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>

            {/* render files */}
            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ) : (
                <p>No files found</p>
            )}
        </div>
    )
}

export default Page
