Rails.application.routes.draw do
  get "/" => "home#top"

  get "users/new" => "users#new"
  post "users/create" => "users#create"
  get "users/timer" => "users#timer"
  get "login" => "users#login_form"
  post "login" => "users#login"
  post "logout" => "users#logout"
  get "users/statistics" => "users#statistics"
  get "users/show" => "users#show"
  post "users/users_edit" => "users#users_edit"
  post "users/content_edit" => "users#content_edit"
  get "users/destroy" => "users#destroy"
  post "users/users_destroy" => "users#users_destroy"
  post "users/content_destroy" => "users#content_destroy"
  
  mount ActionCable.server => "/cable"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
