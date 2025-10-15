#encoding=UTF-8
require 'sinatra'
require 'mongo'
require 'json'
require 'yaml'
require 'faraday'

helpers do 

  def read_config mode
    config = YAML.load_file('db.yaml')

    config[mode]
  end

  def base_url
    key = ENV['MONGOLAB_API_KEY']
    "https://api.mongolab.com/api/1/databases/poetry/collections/poems?apiKey=#{key}"
  end

  def mongo_connect    
    db = read_config 'remotedb' #macbookdb #localdb #remotedb

    @client = Mongo::Connection.new(db['server'], db['port'])
    @db = @client['poetry']        
    @db.authenticate(db['user'], db['pwd']) if db.has_key? :user
    @coll = @db['poems']
  end

  def get_json criteria, method=:get
    #mongo_connect
    content_type :json      
    #coll.find(criteria, {:fields => {:_id=>0}}).sort(:serial).to_a.to_json   

    Faraday.get base_url, 
    if (method == :get)
      url = "#{base_url}&q=#{criteria}"      
      #url = url.gsub(/=>/, ':')    
      resp = Faraday.get url
    else

    end
    resp.body
  end  


  def get_json_rest criteria
    puts criteria
    content_type :json
    conn = Faraday.new(:url => 'https://api.mongolab.com') do |faraday|
      faraday.request  :url_encoded             # form-encode POST params
      faraday.response :logger                  # log requests to STDOUT
      faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end

    puts criteria.to_json
    params = { 'apiKey' => ENV['MONGOLAB_API_KEY'], 's' => '{serial:1}', 'q' => criteria.to_json }
    resp = conn.get('/api/1/databases/poetry/collections/poems', params)

    resp.body
  end

  def merge_recursively(a, b)
    a.merge(b) {|key, a_item, b_item| merge_recursively(a_item, b_item) }
  end

  #Hack to replace chaining .merge calls on hashes with + sign. 
  # Given that a,b and c are hashes, the below method lets us do 
  # a + b + c, instead of 
  # a.merge(b.merge(c))
  class Hash
    def +(y)
      self.merge(y)
    end
  end


  def add_tags
    return {} unless params[:tags]


    tags = params[:tags].split(',')

    puts "and here too #{tags}"
    mongo_connect
    @coll.update(serial_criteria, {"$addToSet" => {'tags' => {"$each" => tags}}} )


    204
  end

  # criteria builders


  def tag_criteria 
    return {} unless params[:tags] # return empty to help with merge
    tags = params[:tags].split(/,/).map{|t| t.strip}
    {'tags' => {"$all" => tags}}
  end

  def get_all_tags
    mongo_connect
    @coll.distinct(:tags).to_json
  end

  def term_criteria 
    return {} unless params[:term]
    #{'text' => /#{params[:term]}/}
    {'text' => {"$regex" => params[:term],"$options" =>"i"}}
  end

  def serial_criteria 
    return {} unless params[:urlkey] and params[:serial]
    
    {'urlkey' => params[:urlkey],'serial' => params[:serial].to_i}  
  end

  def master_criteria
    #tag_criteria.merge(term_criteria.merge(serial_criteria))
    tag_criteria + term_criteria + serial_criteria
  end
end

#api section

#get verb

get '/api/v1/tags/:tags' do
  get_json_rest tag_criteria
end

get '/api/v1/tags' do
  get_all_tags
end

get '/api/v1/searchtext/:term' do  
  get_json_rest term_criteria
end

get '/api/v1/search' do
  get_json_rest master_criteria
end

get '/api/v1/:urlkey/:serial' do  
  get_json_rest serial_criteria
end

#put verb
put '/api/v1/:urlkey/:serial/tags/:tags' do 
  puts 'got here'
  add_tags
end

