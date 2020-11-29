class AddHoursToTimers < ActiveRecord::Migration[5.2]
  def change
    add_column :timers, :hours, :integer
  end
end
