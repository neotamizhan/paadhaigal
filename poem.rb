#encoding=UTF-8
require 'sinatra'
require 'mongo'
require "json"

helpers do 
  def mongo_connect
    @client = Mongo::Connection.new('ds037827.mongolab.com',37827)
    @db = @client['poetry']    
    @db.authenticate('poet','123')
    @coll = @db['poems']

  end

  def get_json criteria
    mongo_connect
    content_type :json      
    @coll.find(criteria).sort(:serial).to_a.to_json           
  end

  def tag_criteria tags
    return nil unless tags
    tags = tags.split(/,/).map{|t| t.strip}
    criteria = {'tags' => {"$all" => tags}}
  end

  def merge_recursively(a, b)
    a.merge(b) {|key, a_item, b_item| merge_recursively(a_item, b_item) }
  end
end

get '/tags/:tags' do
  get_json tag_criteria(params[:tags])
end

get '/searchtext/:term' do
  criteria = {'text' => /#{params[:term]}/}
  tags = tag_criteria("valluvar")
  criteria = merge_recursively(criteria,tags)
  get_json criteria
end

get '/:urlkey/:serial' do
  criteria = {'urlkey' => params[:urlkey], 'serial' => params[:serial].to_i}  

  get_json criteria
end

