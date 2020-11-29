class UsersController < ApplicationController
  require 'date'
  before_action :authenticate_user, {only: [:logout, :timer, :statistics, :user_edit, :content_edit, :destroy, :users_destroy, :content_destroy, :show]}
  before_action :forbid_login_user, {only: [:login_form, :login, :new, :create]}

  def timer
    if @current_user
      @lists = List.where(user_id: @current_user.id)
      from = Time.current.beginning_of_day
      to = Time.current.end_of_day
      gon.timer_list_id1 = Timer.where(user_id: @current_user.id, list_id: 1, datetime: from..to)
      gon.timer_list_id2 = Timer.where(user_id: @current_user.id, list_id: 2, datetime: from..to)
      gon.timer_list_id3 = Timer.where(user_id: @current_user.id, list_id: 3, datetime: from..to)
      gon.list_content1 = List.find_by(user_id: @current_user.id, list_id: 1)
      gon.list_content2 = List.find_by(user_id: @current_user.id, list_id: 2)
      gon.list_content3 = List.find_by(user_id: @current_user.id, list_id: 3)
    end
  end
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(
      name: params[:name],
      email: params[:email],
      image_name: "default_user.jpg",
      password: params[:password]
    )
    if @user.save
      session[:user_id] = @user.id
      flash[:notice] = "登録が完了しました"
      redirect_to("/users/timer")
    else
      render("users/new")
    end
  end

  def login_form
    @user = User.new
  end

  def login
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      cookies.encrypted[:user_id] = @user.id
      flash[:notice] = "ログインしました"
      redirect_to("/users/timer")
    else
      @email = params[:email]
      @password = params[:password]
      @error_message = "Emailまたは、Passwordが正しくありません"
      render("users/login_form")
    end
  end

  def logout
    session[:user_id] = nil
    cookies.encrypted[:user_id] = nil
    flash[:notice] = "ログアウトしました"
    redirect_to("/login")
  end

  def show
    @user = User.find_by(id: @current_user.id)
    @lists = List.where(user_id: @current_user.id)
  end

  def users_edit
    @user = User.find_by(id: @current_user.id)
    if params[:name]
      @user.name = params[:name]
    end
    if @user.email != params[:email]
      @user.email = params[:email]
    end
    if params[:password]
      @user.password = params[:password]
    end
    if @user.save
      flash[:notice] = "ユーザー情報を編集しました"
      redirect_to("/users/show")
    else
      render("users/show")
    end
  end

  def content_edit
    if params[:content1]
      @list1 = List.find_by(user_id: @current_user.id, list_id: 1)
      if @list1.list_content != params[:content1]
        @list1.list_content = params[:content1]
      end
      @list1.save
    end
    if params[:content2]
      @list2 = List.find_by(user_id: @current_user.id, list_id: 2)
      if @list2.list_content != params[:content2]
        @list2.list_content = params[:content2]
      end
      @list2.save
    end
    if params[:content3]
      @list3 = List.find_by(user_id: @current_user.id, list_id: 3)
      if @list3.list_content != params[:content3]
        @list3.list_content = params[:content3]
      end
      @list3.save
    end   
      flash[:notice] = "学習内容を編集しました"
      redirect_to("/users/show")
  end

  def destroy
    @user = User.find_by(id: @current_user.id)
    @lists = List.where(user_id: @current_user.id)
  end

  def users_destroy
    @user = User.find_by(id: @current_user.id)
    @timers = Timer.where(user_id: @current_user.id)
    @lists = List.where(user_id: @current_user.id)
    if @user
      @user.destroy
    end
    if @timers 
      @timers.destroy_all
    end
    if @lists 
      @lists.destroy_all
    end
    session[:user_id] = nil
    flash[:notice] = "退会しました"
    redirect_to("/login")
  end

  def content_destroy
    @list1 = List.find_by(user_id: @current_user.id, list_id: 1)
    @list2 = List.find_by(user_id: @current_user.id, list_id: 2)
    @list3 = List.find_by(user_id: @current_user.id, list_id: 3)
    @timer1 = Timer.where(user_id: @current_user.id, list_id: 1)
    @timer2 = Timer.where(user_id: @current_user.id, list_id: 2)
    @timer3 = Timer.where(user_id: @current_user.id, list_id: 3)
    if params[:content1]
      @list1.destroy
      @timer1.destroy_all
      flash[:notice] = "Content を削除しました"
      redirect_to("/users/destroy")
    end
    if params[:content2]
      @list2.destroy
      @timer2.destroy_all
      flash[:notice] = "Content を削除しました"
      redirect_to("/users/destroy")
    end
    if params[:content3]
      @list3.destroy
      @timer3.destroy_all
      flash[:notice] = "Content を削除しました"
      redirect_to("/users/destroy")
    end
  end

  def statistics
    if @current_user
      @lists = List.where(user_id: @current_user.id)
      gon.list_id1 = Timer.where(user_id: @current_user.id, list_id: 1)
      gon.list_id2 = Timer.where(user_id: @current_user.id, list_id: 2)
      gon.list_id3 = Timer.where(user_id: @current_user.id, list_id: 3)
      gon.list_content1 = List.find_by(user_id: @current_user.id, list_id: 1)
      gon.list_content2 = List.find_by(user_id: @current_user.id, list_id: 2)
      gon.list_content3 = List.find_by(user_id: @current_user.id, list_id: 3)
    end
  end
end