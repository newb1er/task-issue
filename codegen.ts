import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
    schema: [
        {
            'https://api.github.com/graphql': {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    'user-agent': 'Graphql Codegen'
                }
            }
        }
    ],
    documents: ['app/**/*.tsx'],
    ignoreNoDocuments: true,
    emitLegacyCommonJSImports: false,
    generates: {
        './app/gql/': {
            preset: 'client'
        }
    }
};

export default config;