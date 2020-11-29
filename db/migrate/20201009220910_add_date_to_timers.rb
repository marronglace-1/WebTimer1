class AddDateToTimers < ActiveRecord::Migration[5.2]
  def change
    add_column :timers, :deadline, :date
  end
end
