# பாதைகள் (Paadhaigal)

## Overview

**Paadhaigal** (meaning "Paths" in Tamil) is a search engine for ancient Tamil literature. It provides a web-based interface to search through classic Tamil poetry, including works like Thirukkural, with support for text search, tag-based filtering, and serial number lookup.

The project title "பழந்தமிழ் பாடல்களுக்கான தேடுபொறி" translates to "Search Engine for Ancient Tamil Poems."

## Technology Stack

### Backend
- **Ruby (Sinatra)**: Lightweight web framework for the REST API
- **MongoDB**: NoSQL database for storing poems
- **MongoLab API**: Cloud-hosted MongoDB service
- **Faraday**: HTTP client for API requests

### Frontend
- **AngularJS**: Single-page application framework
- **Bootstrap**: Responsive UI framework
- **jQuery**: DOM manipulation and utilities
- **HTML5 Boilerplate**: Professional front-end template

### Deployment
- **Heroku**: Cloud platform (configured via Procfile)
- **Rack**: Ruby web server interface

## Architecture

### Project Structure

```
paadhaigal/
├── poem.rb              # Main Sinatra application (backend API)
├── config.ru            # Rack configuration file
├── Gemfile              # Ruby dependencies
├── Procfile             # Heroku deployment configuration
├── db.yaml.example      # Database configuration template
└── public/              # Frontend static files
    ├── index.html       # Main HTML page
    ├── js/
    │   ├── app.js       # AngularJS application logic
    │   └── vendor/      # Third-party libraries
    ├── css/             # Stylesheets
    └── doc/             # HTML5 Boilerplate documentation
```

### Backend Architecture (`poem.rb`)

The backend is built with Sinatra and provides a REST API for searching poems. Key components:

#### Helper Methods
- **`read_config(mode)`**: Loads database configuration from `db.yaml`
- **`mongo_connect()`**: Establishes connection to MongoDB
- **`get_json_rest(criteria)`**: Fetches poems from MongoLab API as JSON
- **`tag_criteria()`**: Builds MongoDB query for tag-based search
- **`term_criteria()`**: Builds MongoDB query for text search (case-insensitive regex)
- **`serial_criteria()`**: Builds MongoDB query for specific poem by serial number
- **`master_criteria()`**: Combines multiple search criteria using hash merging

#### API Endpoints

**GET Endpoints:**
- `/api/v1/tags/:tags` - Search poems by tags
- `/api/v1/tags` - Get all available tags
- `/api/v1/searchtext/:term` - Search poems by text content
- `/api/v1/search` - Combined search (tags + text + serial)
- `/api/v1/:urlkey/:serial` - Get specific poem by URL key and serial number

**PUT Endpoints:**
- `/api/v1/:urlkey/:serial/tags/:tags` - Add tags to a specific poem

### Frontend Architecture (`public/js/app.js`)

The frontend is an AngularJS single-page application with the following components:

#### Angular Modules
- **SharedServices**: HTTP interceptor for loading indicators
- **app**: Main application module with Poetry controller

#### Services
- **Poetry**: Factory service wrapping MongoLab HTTP resource for poem operations

#### Controller (`PoetryCtrl`)
Main controller managing search functionality and UI state:

**Scope Variables:**
- `$scope.poems`: Array of poem results
- `$scope.term`: Search input text
- `$scope.queryObject`: MongoDB query configuration
- `$scope.pluralizer`: Tamil language pluralization rules for result counts

**Search Methods:**
- `search()`: Main search dispatcher (detects search type from input)
- `searchTerms()`: Text-based search using regex
- `searchTags()`: Tag-based search (format: "tags:tag1,tag2")
- `searchBySerial()`: Search by URL key and serial number (format: "urlkey serial")
- `fetchAllTags()`: Retrieve all available tags from database

### Data Model

Poems in the database have the following structure:

```javascript
{
  "author": "valluvar",
  "explanation": "As all letters have the letter A for their first...",
  "name": "thirukkural",
  "serial": 1,
  "tags": ["thirukkural", "valluvar", "அறத்துப்பால்", "கடவுள் வாழ்த்து"],
  "text": ["அகர முதல எழுத்தெல்லாம் ஆதி", "பகவன் முதற்றே உலகு."],
  "translation": "A, as its first of letters...",
  "urlkey": "kural",
  "book": "திருக்குறள்",
  "urai": "உரை explanation text"
}
```

**Fields:**
- `author`: Poet's name
- `explanation`: English explanation of the poem
- `name`: Name of the literary work
- `serial`: Sequential number within the work
- `tags`: Array of tags (Tamil and English)
- `text`: Array of poem lines in Tamil
- `translation`: English translation
- `urlkey`: Unique identifier for the work
- `book`: Book/section name (optional)
- `urai`: Tamil commentary (optional)

## Features

### Search Capabilities
1. **Full-text search**: Search Tamil poems by any text content (case-insensitive)
2. **Tag-based filtering**: Search using tags (e.g., "tags:thirukkural,valluvar")
3. **Serial number lookup**: Find specific poems (e.g., "kural 1")
4. **Combined search**: Use multiple criteria simultaneously
5. **Clickable tags**: Click any tag in results to search poems with that tag

### User Interface
- Tamil language interface with Tamil labels
- Responsive design using Bootstrap
- Loading indicators with Tamil text ("சற்றே பொறுமின்...")
- Result count pluralization in Tamil
- Visual poem dividers for better readability
- Translation display in different font (Didact Gothic)

### Database Features
- Case-insensitive text search using MongoDB regex
- Tag-based organization with multiple tags per poem
- Serial number indexing for ordered works
- Support for multiple literary works via URL keys

## Setup Instructions

### Prerequisites
- Ruby 2.x or higher
- Bundler gem
- MongoDB account (MongoLab/Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/neotamizhan/paadhaigal.git
cd paadhaigal
```

2. Install Ruby dependencies:
```bash
bundle install
```

3. Configure database:
```bash
cp db.yaml.example db.yaml
# Edit db.yaml with your MongoDB credentials
```

4. Start the server:
```bash
# Development
ruby poem.rb

# Or with Rack
bundle exec rackup config.ru

# Heroku deployment
git push heroku master
```

### Database Configuration

Create `db.yaml` with your MongoDB connection details:

```yaml
localdb:
  server: localhost
  port: 27017

remotedb:
  server: your-mongo-host
  port: 27017
  user: your-username
  pwd: your-password
```

## Usage Examples

### Text Search
Search for poems containing specific Tamil words:
```
Input: "ஆதி"
Result: Returns all poems containing "ஆதி"
```

### Tag Search
Search by tags (comma-separated):
```
Input: "tags:thirukkural,valluvar"
Result: Returns poems with both tags
```

### Serial Number Search
Find a specific poem by its number:
```
Input: "kural 1"
Result: Returns Thirukkural poem #1
```

## API Usage

### Get Poems by Tags
```bash
curl http://localhost:4567/api/v1/tags/thirukkural,valluvar
```

### Search by Text
```bash
curl http://localhost:4567/api/v1/searchtext/ஆதி
```

### Get All Tags
```bash
curl http://localhost:4567/api/v1/tags
```

### Get Specific Poem
```bash
curl http://localhost:4567/api/v1/kural/1
```

## Key Code Patterns

### Hash Merging Operator
The codebase includes a clever hack to simplify hash merging in Ruby:

```ruby
class Hash
  def +(y)
    self.merge(y)
  end
end

# Allows: tag_criteria + term_criteria + serial_criteria
# Instead of: tag_criteria.merge(term_criteria.merge(serial_criteria))
```

### Smart Search Detection
The frontend automatically detects search type:
- "tags:..." → Tag search
- "urlkey number" → Serial search
- Default → Text search

### HTTP Interceptor
Loading state is managed globally via AngularJS HTTP interceptor:
- Shows loading message on all HTTP requests
- Hides loading message on completion/error
- Provides consistent UX across all searches

## Dependencies

### Ruby Gems
- `sinatra`: Web framework
- `mongo`: MongoDB driver
- `json`: JSON parsing
- `bson_ext`: BSON performance extensions
- `faraday`: HTTP client
- `yaml`: Configuration file parsing

### JavaScript Libraries
- AngularJS 1.x: Application framework
- jQuery: DOM utilities
- Bootstrap: UI components
- Modernizr: Feature detection
- mongolabResourceHttp: Custom MongoDB REST API wrapper

## Security Notes

⚠️ **Important**: The current codebase has hardcoded API keys in several files:
- `poem.rb`: MongoLab API key in `base_url`
- `public/js/app.js`: API key in `MONGOLAB_CONFIG`

**For production use**, these should be moved to environment variables or secure configuration.

## Performance Considerations

1. **MongoDB Queries**: Uses indexes on `serial`, `tags`, and `text` fields for optimal search
2. **Regex Search**: Case-insensitive regex (`$options: "i"`) may be slow on large datasets
3. **Frontend**: Loading indicators prevent multiple simultaneous requests
4. **Caching**: Consider adding Redis or similar for frequently accessed poems

## Future Enhancements

Potential improvements for the codebase:
1. Add user authentication for tag editing
2. Implement pagination for large result sets
3. Add autocomplete for tags and search terms
4. Support advanced search with boolean operators
5. Add audio pronunciation for Tamil poems
6. Implement bookmarking/favorites
7. Add social sharing features
8. Create mobile app versions
9. Add more Tamil literary works
10. Implement full-text search indexing for better performance

### 📋 Modernization Roadmap

For a comprehensive plan to modernize this application with AI-powered features, see:
- **[MODERNIZATION_ROADMAP.md](./MODERNIZATION_ROADMAP.md)** - Complete 24-month modernization strategy
- **[AI_FEATURES_SUMMARY.md](./AI_FEATURES_SUMMARY.md)** - Quick reference for 33 AI use-cases

The roadmap covers:
- Security hardening and infrastructure modernization
- Backend migration to Python/FastAPI or modern Ruby/Node.js
- Frontend upgrade to React/Vue with TypeScript
- AI features: semantic search, chatbot, TTS, recommendations, and more
- Mobile apps, PWA, and voice interfaces
- Community features and content expansion
- Performance optimization and scalability

**Quick wins** (first 30 days):
1. Move API keys to environment variables
2. Migrate to MongoDB Atlas
3. Add Redis caching
4. Implement semantic search with embeddings
5. Improve mobile UI

## License

Please check the repository for license information.

## Contributing

Contributions are welcome! This is a project aimed at preserving and making ancient Tamil literature accessible to everyone.

---

**Note**: This project celebrates Tamil literary heritage and makes it searchable for scholars, students, and enthusiasts worldwide.
