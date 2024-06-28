TITLE: Real-time Data Classification API

DESCRIPTION: API that processes a live stream of data, classifies it based on user-defined classification rules, and authenticates incoming requests using JWT tokens

    1: Project Initialization:
        i. Express.js and Node.js is used to initialize the project
        ii. Installed packages for JWT, database connectivity, and WebSocket/SSE, express, 
       Managed dependencies using npm
    
    2: Authentication
        The authentication is done using JWT tokens.
        
    3: Data Models and Database
        i. The Database used in the project is MongoDB. It stores the Username, Hashed Password, email, and the query which user enters 
        ii. Implemented CRUD operations for classification rules.
    
    4: User-Defined Classification Rules
        i. After a user login successfully he/she can add their queries. Which is stored in the database
        ii. The query or the classification rules are provided in the following format, below are some examples:
             Ex: "rule count('a') > 4 end" // note that rule must start with "rule" and must end with "end"
        iii. The processing of DSL is coded such that it will execute only if the above condition is met.
        
    5: Classification DSL:
        i. Designed a Domain Specific Language (DSL) for rules.
        ii. When a user enters a query. Lexer converts queries into tokens the parser uses the tokens and generates an AST tree and the interpreter processes the AST tree to produce output

INSTALLATION:

    1: Clone the Repository
            code: https://github.com/diggu17/Live-stream-api.git

    2: Navigate to the project directory:
            ex: cd project-name
    3: Install dependencies:
            code: npm install

USAGE:

    1: To run the project use:
        "npm start"
    2: To run Tests:
        "npm test"

FEATURES:

    Some of the key features of the projects are:

    i. JWT Authentication
        The project includes JWT (JSON Web Token) authentication to ensure secure and reliable user sessions. Key features of this implementation include:
        
        ->JWT Authentication Middleware: Middleware has been integrated to handle JWT authentication, ensuring secure access to protected routes.
        ->Token Validation: All incoming requests are validated to ensure they contain a valid JWT token in the header, safeguarding against unauthorized access.
        ->User Signup and Login Endpoints: I have created endpoints for user signup and login, enabling users to securely register and authenticate.

    ii. Data Models and Database
        The project includes a comprehensive design and implementation of the database schema, focusing on user-defined rules and associated operations

            
