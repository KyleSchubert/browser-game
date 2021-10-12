module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'google'
    ],
    'parserOptions': {
        'ecmaVersion': 13
    },
    'rules': {
        'indent': [
            'error',
            4,
            {'SwitchCase': 1}
        ],
        'max-len': [
            'error',
            170
        ],
        'no-unused-vars': [
            'error',
            {'vars': 'local', 'args': 'after-used'}
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        'brace-style': [
            'error',
            'stroustrup'
        ]

    }
};
