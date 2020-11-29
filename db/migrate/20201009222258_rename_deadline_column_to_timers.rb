class RenameDeadlineColumnToTimers < ActiveRecord::Migration[5.2]
  def change
    rename_column :timers, :deadline, :date
  end
end
