class TimerChannel < ApplicationCable::Channel

  def subscribed
    stream_from "timer_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def timer_set(timer_data)
    @timer = Timer.new(
      user_id: current_user.id,
      list_id: timer_data["list_id"],
      minutes: timer_data["minute"],
      date: Time.current,
      datetime: Time.current,
      hours: timer_data["hour"]
    ) 
    @timer.save
    ActionCable.server.broadcast "timer_channel", timer_data["list_id", "minute", "hour"]
  end

  def list_set(list_data)
    @list = List.new(
      user_id: current_user.id,
      list_id: list_data["list_id"],
      list_content: list_data["list_content"],
      list_name: list_data["list_name"])
    @list.save
    ActionCable.server.broadcast "timer_channel", list_data["list_id", "list_content", "list_name"]
  end

end
