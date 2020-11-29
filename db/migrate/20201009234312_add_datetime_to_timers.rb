class AddDatetimeToTimers < ActiveRecord::Migration[5.2]
  def change
    add_column :timers, :datetime, :datetime
  end
end
