#encoding=UTF-8
require 'sinatra'
require 'mongo'
require 'json'
require 'yaml'

helpers do 

  def read_config mode
    config = YAML.load_file('db.yaml')

    config[mode]
  end

  def mongo_connect    
    db = read_config 'remotedb' #macbookdb #localdb #remotedb

    @client = Mongo::Connection.new(db[:server], db[:port])
    @db = @client['poetry']        
    @db.authenticate(db[:user], db[:pwd]) if db.has_key? :user
    @coll = @db['poems']
  end

  def get_json criteria
    mongo_connect
    content_type :json      
    @coll.find(criteria, {:fields => {:_id=>0}}).sort(:serial).to_a.to_json           
  end

  def merge_recursively(a, b)
    a.merge(b) {|key, a_item, b_item| merge_recursively(a_item, b_item) }
  end

  #Hack to replace chaining .merge calls on hashes with + sign. 
  class Hash
    def +(y)
      self.merge(y)
    end
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
    {'text' => /#{params[:term]}/}
  end

  def serial_criteria 
    return {} unless params[:urlkey] and params[:serial]
    
    {'urlkey' => params[:urlkey], 'serial' => params[:serial].to_i}  
  end

  def master_criteria
    #tag_criteria.merge(term_criteria.merge(serial_criteria))
    tag_criteria + term_criteria + serial_criteria
  end
end

#api section

#getters

get '/api/v1/tags/:tags' do
  get_json tag_criteria
end

get '/api/v1/tags' do
  get_all_tags
end

get '/api/v1/searchtext/:term' do  
  get_json term_criteria
end

get '/api/v1/search' do
  get_json master_criteria
end

get '/api/v1/:urlkey/:serial' do  
  get_json serial_criteria
end

