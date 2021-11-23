module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    'extends': [
        'eslint:recommended'
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
        'max-len': "off",
        'no-unused-vars': "off",
        'comma-dangle': [
            'error',
            'never'
        ],
        'brace-style': [
            'error',
            'stroustrup'
        ],
        'no-undef': "off",
        'semi': [
            2, 
            "always"
        ]
    }
};
