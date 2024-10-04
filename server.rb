require 'debug'
# use binding.break for debug

class Server < Sinatra::Base

    def initialize
        super
        @db = SQLite3::Database.new('db/company.db')
        @db.results_as_hash = true
    end

    before do
        #content_type :json
        #headers 'Access-Control-Allow-Origin' => '*',
        #        'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    set :protection, false

    get '/' do
        erb :index
    end

    get '/slow' do
        content_type :json
        sleep 2
        return {result: 'slow'}.to_json
    end

    # Build the app using this route to deliver js for the SPA.
    get '/app' do
        erb :app
    end

    #CRUD-interface med JS

    #index
    get '/api/employees' do
        content_type :json
        @db.execute('SELECT * FROM employees').to_json
    end

    #new
    get '/api/employees/new' do
        content_type :json
        {formFields: [{name:  'text'},
                  {email: 'text'},
                  {phone: 'tel'},
                  {department_id: 'number'},
                  {img:  'image'}]}.to_json
    end

    #show
    get '/api/employees/:id' do
        content_type :json
        @db.execute('SELECT * FROM employees WHERE id = ?', params['id']).first.to_json
    end

    #get department labels
    get '/api/employees/departments' do
        content_type :json
        result = @db.execute('SELECT * FROM departments').to_json
    end

    # get department label by id
    get 'api/employees/department/:id' do
        content_type :json
        @db.execute('SELECT * FROM departments WHERE id = ?', params['id']).first.to_json
    end

    #edit
    get '/api/employees/:id/edit' do
        content_type :json
        result = @db.execute('SELECT * FROM employees WHERE id = ?', params['id']).first
        {employee: result,
         formFields: [
                {name: 'name',          type: 'text',   value: result['name']},
                {name: 'email',         type: 'text',   value: result['email']},
                {name: 'phone',         type: 'tel',    value: result['phone']},
                {name: 'department_id', type: 'number', value: result['department_id']},
                {name: 'img',           type: 'img',    value: result['img']}
            ]}.to_json
    end

    #update
    post '/api/employees/:id' do
        id = params['id']
        payload = JSON.parse request.body.read # data sent using fetch is placed in request body
        content_type :json
        result = @db.execute('UPDATE employees
                              SET name=?, email=?, phone=?, department_id=?, img=?
                              WHERE id = ?',
                              [payload['name'], payload['email'], payload['phone'], payload['department_id'], payload['img'], id])
        return {result: 'success'}.to_json
    end

    post "/api/uploadImage" do
        if params[:file]
            filename = params[:file][:filename]
            file = params[:file][:tempfile]
        
            # Save the file to a directory
            File.open("./public/img/#{filename}", 'wb') do |f|
              f.write(file.read)
            end
            return {result: 'success'}.to_json
        end
    end

    #create
    post '/api/employees/' do
        payload = JSON.parse request.body.read
        content_type :json
        result = @db.execute('INSERT into employees (name, email, phone, department_id, img)
                              VALUES (?,?,?,?,?)',[
                              payload['name'], payload['email'], payload['phone'], payload['department_id'], payload['img']])
        return {result: 'success'}.to_json
    end

    #destroy
    delete '/api/employees/:id' do
        content_type :json
        result = @db.execute('DELETE FROM employees WHERE id = ?', params['id'])
        return {result: 'success'}.to_json
    end
end
